import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import {
  buildContentIndex,
  compilePostFile,
  renderIndexModule,
  renderPostModule,
  CONTENT_DIR,
  POSTS_DIR,
} from "../lib/content.ts";
import type { ContentIndex } from "../src/types.ts";
import { site } from "../site.config.ts";

const VIRTUAL_ID = "virtual:content";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

/**
 * contents/posts 아래의 마크다운 파일을 빌드 타임에 JS 모듈로 바꾸고,
 * 메타데이터만 담은 `virtual:content` 인덱스를 제공합니다.
 *
 * - `.md` import 결과: { meta, html, headings, readingTime, seriesNav }
 * - `virtual:content`: { posts, tags, series, routes, generatedAt }
 * - `.content/index.json`은 prerender 스크립트가 읽는 빌드 산출물입니다.
 */
export function content(): Plugin {
  let root = process.cwd();
  let command: "build" | "serve" = "build";
  let index: ContentIndex | null = null;
  let generatedAt = "";
  let refreshing: Promise<ContentIndex> | null = null;

  const includeDrafts = () => command === "serve";

  async function refresh(): Promise<ContentIndex> {
    if (refreshing) return refreshing;

    refreshing = (async () => {
      const next = await buildContentIndex(root, { includeDrafts: includeDrafts() });
      index = next;
      generatedAt = new Date().toISOString();

      const outDir = path.join(root, ".content");
      await mkdir(outDir, { recursive: true });
      await writeFile(
        path.join(outDir, "index.json"),
        JSON.stringify({ ...next, generatedAt, site }, null, 2),
      );

      return next;
    })().finally(() => {
      refreshing = null;
    });

    return refreshing;
  }

  async function ensureIndex(): Promise<ContentIndex> {
    return index ?? refresh();
  }

  return {
    name: "blog-content",
    enforce: "pre",

    configResolved(config) {
      root = config.root;
      command = config.command;
    },

    async buildStart() {
      await refresh();
    },

    configureServer(server) {
      const contentDir = path.join(root, CONTENT_DIR);
      server.watcher.add(contentDir);

      const reload = async (file: string, structural: boolean) => {
        if (!file.startsWith(contentDir) || !file.endsWith(".md")) return;
        await refresh();
        if (structural) {
          // 새 파일/삭제는 import.meta.glob 결과 자체가 바뀌므로
          // 라우트 모듈을 다시 변환해야 합니다.
          server.moduleGraph.invalidateAll();
        }
        server.ws.send({ type: "full-reload" });
      };

      server.watcher.on("add", (file) => void reload(file, true));
      server.watcher.on("unlink", (file) => void reload(file, true));
      server.watcher.on("change", (file) => void reload(file, false));
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },

    async load(id) {
      if (id === RESOLVED_ID) {
        const current = await ensureIndex();
        return renderIndexModule(current, generatedAt);
      }

      if (id.endsWith(".md")) {
        const file = id.split("?")[0];
        const postsDir = path.join(root, POSTS_DIR);
        if (!file.startsWith(postsDir)) return null;

        const current = await ensureIndex();
        const post = await compilePostFile(file, { index: current });
        return renderPostModule(post);
      }

      return null;
    },
  };
}
