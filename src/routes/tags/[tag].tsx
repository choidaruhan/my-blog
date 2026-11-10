import { createMemo, For } from "solid-js";
import type { RouteProps } from "@solidjs/router";
import { posts, tags } from "virtual:content";
import { site } from "../../../site.config";
import Ledger from "../../components/Ledger";
import Seo from "../../components/Seo";
import { tagHref } from "../../lib/format";

const pillBase =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors";
const pill = `${pillBase} bg-surface-soft text-ink-soft hover:bg-line hover:text-ink-strong`;
const pillActive = `${pillBase} bg-ink-strong text-surface`;

export default function TagPage(props: RouteProps<"/tags/:tag">) {
  const tag = () => props.params.tag;
  const filtered = createMemo(() => posts.filter((post) => post.tags.includes(tag())));

  return (
    <>
      <Seo
        title={`${tag()} · ${site.title}`}
        description={`${tag()} 태그가 붙은 글 모음.`}
        path={`/tags/${tag()}`}
      />

      <header class="pt-2 pb-6">
        <p class="mb-2 text-xs font-semibold text-ink-soft">태그</p>
        <h1 class="text-balance text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.035em]">
          #{tag()}
        </h1>
        <p class="mt-3 max-w-[54ch] text-16 leading-[1.75] text-ink-soft">
          {filtered().length}편의 글.
        </p>
      </header>

      <div class="pb-8">
        <div
          class="flex items-center gap-2 overflow-x-auto pb-5 [scrollbar-width:none]"
          aria-label="다른 태그"
        >
          <a class={pill} href="/tags">
            전체 태그
          </a>
          <For each={tags.slice(0, 5)}>
            {(item) => (
              <a
                class={`${item.tag === tag() ? pillActive : pill}`}
                href={tagHref(item.tag)}
              >
                #{item.tag}
              </a>
            )}
          </For>
        </div>

        <Ledger posts={filtered()} />
      </div>
    </>
  );
}
