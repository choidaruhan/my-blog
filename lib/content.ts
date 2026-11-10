import { readFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import { z } from "zod";
import type {
  CompiledPost,
  ContentIndex,
  Heading,
  PostMeta,
  SeriesInfo,
  SeriesNav,
  TagCount,
} from "../src/types.ts";

export const CONTENT_DIR = "contents";
export const POSTS_DIR = "contents/posts";

const frontmatterSchema = z.object({
  title: z.string().min(1, "title은 비워둘 수 없습니다"),
  description: z.string().min(1, "description은 비워둘 수 없습니다"),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  series: z.string().optional(),
  seriesTitle: z.string().optional(),
  seriesOrder: z.number().int().positive().optional(),
  draft: z.boolean().default(false),
  cover: z.string().optional(),
  slug: z.string().optional(),
});

type Frontmatter = z.infer<typeof frontmatterSchema>;

const SLUG_RE = /^[a-z0-9][a-z0-9\-_/]*$/;

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function assertSlug(slug: string, file: string): string {
  if (!SLUG_RE.test(slug)) {
    throw new Error(
      `[content] 잘못된 slug "${slug}" (${file}). ` +
        `slug는 소문자 영문, 숫자, -, _, / 만 사용할 수 있습니다.`,
    );
  }
  return slug;
}

function slugFromFile(file: string): string {
  const relative = path.relative(path.resolve(POSTS_DIR), file).split(path.sep).join("/");
  return relative.replace(/\.md$/, "");
}

function parseFrontmatter(raw: string, file: string): { data: Frontmatter; content: string } {
  const parsed = matter(raw);
  const result = frontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n  ");
    throw new Error(`[content] ${file}의 frontmatter가 올바르지 않습니다:\n  ${issues}`);
  }
  return { data: result.data, content: parsed.content };
}

function toMeta(data: Frontmatter, file: string, readingTime: number): PostMeta {
  const slug = assertSlug(data.slug ?? slugFromFile(file), file);
  return {
    slug,
    title: data.title,
    description: data.description,
    date: toIsoDate(data.date),
    updated: data.updated ? toIsoDate(data.updated) : undefined,
    tags: [...new Set(data.tags.map((tag) => tag.trim()).filter(Boolean))],
    series: data.series,
    seriesTitle: data.seriesTitle,
    seriesOrder: data.seriesOrder,
    draft: data.draft,
    cover: data.cover,
    readingTime,
  };
}

/* -------------------------------------------------------------------------- */
/* markdown -> html                                                           */
/* -------------------------------------------------------------------------- */

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: "append",
    properties: {
      className: ["heading-anchor"],
      ariaLabel: "이 섹션 링크",
      "data-pagefind-ignore": "true",
    },
    content: { type: "text", value: "#" },
  })
  .use(rehypeShiki, {
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
    defaultLanguage: "text",
    fallbackLanguage: "text",
    langs: [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "jsonc",
      "bash",
      "shell",
      "css",
      "html",
      "md",
      "mdx",
      "yaml",
      "diff",
      "sql",
      "python",
      "rust",
      "go",
    ],
  })
  .use(rehypeStringify, { allowDangerousHtml: true });

interface MarkdownNode {
  type: string;
  value?: string;
  depth?: number;
  children?: MarkdownNode[];
}

function nodeText(node: MarkdownNode): string {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  if (!node.children) return "";
  return node.children.map(nodeText).join("");
}

function textForReadingTime(node: MarkdownNode): string {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  if (node.type === "code") return "";
  if (!node.children) return "";
  return node.children.map(textForReadingTime).join(" ");
}

function estimateReadingTime(node: MarkdownNode): number {
  const text = textForReadingTime(node);
  const words = (text.match(/[\p{L}\p{N}]+/gu) ?? []).length;
  const chars = text.replace(/\s+/g, "").length;
  // 한국어는 글자 수 기준, 영문은 단어 수 기준으로 계산해 큰 쪽을 씁니다.
  const byWords = words / 220;
  const byChars = chars / 500;
  return Math.max(1, Math.ceil(Math.max(byWords, byChars)));
}

function extractHeadings(node: MarkdownNode, slugger: GithubSlugger, out: Heading[]): void {
  if (node.type === "heading" && typeof node.depth === "number") {
    const text = nodeText(node).trim();
    const id = slugger.slug(text);
    if (text && node.depth >= 2 && node.depth <= 4) {
      out.push({ id, text, depth: node.depth });
    }
    return;
  }
  for (const child of node.children ?? []) {
    extractHeadings(child, slugger, out);
  }
}

async function compileMarkdown(markdown: string): Promise<{
  html: string;
  headings: Heading[];
  readingTime: number;
}> {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as unknown as MarkdownNode;
  const headings: Heading[] = [];
  extractHeadings(tree, new GithubSlugger(), headings);
  const readingTime = estimateReadingTime(tree);
  const file = await markdownProcessor.process(markdown);
  return { html: String(file), headings, readingTime };
}

/* -------------------------------------------------------------------------- */
/* scanning                                                                   */
/* -------------------------------------------------------------------------- */

interface ParsedPost {
  file: string;
  data: Frontmatter;
  content: string;
}

async function scanPosts(root: string): Promise<ParsedPost[]> {
  const dir = path.join(root, POSTS_DIR);
  const files = await fg("**/*.md", {
    cwd: dir,
    absolute: true,
    onlyFiles: true,
  });

  files.sort();

  const posts: ParsedPost[] = [];
  for (const file of files) {
    const raw = await readFile(file, "utf8");
    const { data, content } = parseFrontmatter(raw, path.relative(root, file));
    posts.push({ file, data, content });
  }
  return posts;
}

function isPublished(meta: PostMeta, now: Date, includeDrafts: boolean): boolean {
  if (includeDrafts) return true;
  if (meta.draft) return false;
  return meta.date <= toIsoDate(now);
}

function buildSeries(posts: PostMeta[]): SeriesInfo[] {
  const groups = new Map<string, PostMeta[]>();
  for (const post of posts) {
    if (!post.series) continue;
    const list = groups.get(post.series) ?? [];
    list.push(post);
    groups.set(post.series, list);
  }

  return [...groups.entries()]
    .map(([name, list]) => {
      const sorted = [...list].sort((a, b) => {
        const orderA = a.seriesOrder ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.seriesOrder ?? Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        return a.date.localeCompare(b.date);
      });
      return {
        name,
        title: sorted.find((post) => post.seriesTitle)?.seriesTitle ?? name,
        posts: sorted,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "ko"));
}

function buildTags(posts: PostMeta[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

function buildRoutes(posts: PostMeta[], tags: TagCount[], series: SeriesInfo[]): string[] {
  const routes = new Set<string>([
    "/",
    "/blog",
    "/about",
    "/design",
    "/search",
    "/tags",
    "/series",
    "/404",
  ]);
  for (const post of posts) routes.add(`/blog/${post.slug}`);
  for (const tag of tags) routes.add(`/tags/${tag.tag}`);
  for (const item of series) routes.add(`/series/${item.name}`);
  return [...routes];
}

export interface IndexOptions {
  includeDrafts?: boolean;
  now?: Date;
}

export async function buildContentIndex(
  root: string,
  options: IndexOptions = {},
): Promise<ContentIndex> {
  const { includeDrafts = false, now = new Date() } = options;
  const parsed = await scanPosts(root);

  const posts: PostMeta[] = [];
  const files: Record<string, string> = {};
  for (const post of parsed) {
    const { readingTime } = await compileMarkdown(post.content);
    const meta = toMeta(post.data, post.file, readingTime);
    if (isPublished(meta, now, includeDrafts)) {
      posts.push(meta);
      files[meta.slug] = "/" + path.relative(root, post.file).split(path.sep).join("/");
    }
  }

  posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "ko"));

  const tags = buildTags(posts);
  const series = buildSeries(posts);
  return { posts, tags, series, files, routes: buildRoutes(posts, tags, series) };
}

/* -------------------------------------------------------------------------- */
/* single post                                                                */
/* -------------------------------------------------------------------------- */

export interface CompileOptions {
  index: ContentIndex;
}

export async function compilePostFile(
  file: string,
  options: CompileOptions,
): Promise<CompiledPost> {
  const raw = await readFile(file, "utf8");
  const { data, content } = parseFrontmatter(raw, file);
  const compiled = await compileMarkdown(content);
  const meta = toMeta(data, file, compiled.readingTime);

  let seriesNav: SeriesNav | null = null;
  if (meta.series) {
    const group = options.index.series.find((item) => item.name === meta.series);
    if (group) {
      const position = group.posts.findIndex((post) => post.slug === meta.slug);
      seriesNav = {
        name: group.name,
        title: group.title,
        prev: position > 0 ? toLink(group.posts[position - 1]) : null,
        next:
          position >= 0 && position < group.posts.length - 1
            ? toLink(group.posts[position + 1])
            : null,
      };
    }
  }

  return {
    meta,
    html: compiled.html,
    headings: compiled.headings,
    readingTime: compiled.readingTime,
    seriesNav,
  };
}

function toLink(post: PostMeta): { slug: string; title: string } {
  return { slug: post.slug, title: post.title };
}

/* -------------------------------------------------------------------------- */
/* virtual module source                                                      */
/* -------------------------------------------------------------------------- */

export function renderPostModule(post: CompiledPost): string {
  return [
    `export const meta = ${JSON.stringify(post.meta)};`,
    `export const html = ${JSON.stringify(post.html)};`,
    `export const headings = ${JSON.stringify(post.headings)};`,
    `export const readingTime = ${JSON.stringify(post.readingTime)};`,
    `export const seriesNav = ${JSON.stringify(post.seriesNav)};`,
    `const post = { meta, html, headings, readingTime, seriesNav };`,
    `export default post;`,
  ].join("\n");
}

export function renderIndexModule(index: ContentIndex, generatedAt: string): string {
  return [
    `export const posts = ${JSON.stringify(index.posts)};`,
    `export const tags = ${JSON.stringify(index.tags)};`,
    `export const series = ${JSON.stringify(index.series)};`,
    `export const routes = ${JSON.stringify(index.routes)};`,
    `export const files = ${JSON.stringify(index.files)};`,
    `export const generatedAt = ${JSON.stringify(generatedAt)};`,
    `const index = { posts, tags, series, routes, files, generatedAt };`,
    `export default index;`,
  ].join("\n");
}
