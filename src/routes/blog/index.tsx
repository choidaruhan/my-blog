import { For } from "solid-js";
import { posts, tags } from "virtual:content";
import { site } from "../../../site.config";
import Ledger from "../../components/Ledger";
import Seo from "../../components/Seo";
import { tagHref } from "../../lib/format";

const pillBase =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors";
const pill = `${pillBase} bg-surface-soft text-ink-soft hover:bg-line hover:text-ink-strong`;
const pillActive = `${pillBase} bg-ink-strong text-surface`;

export default function BlogIndex() {
  return (
    <>
      <Seo
        title={`글 · ${site.title}`}
        description="지금까지 남긴 모든 기록."
        path="/blog"
      />

      <header class="pt-2 pb-6">
        <h1 class="text-balance text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.035em]">
          글
        </h1>
        <p class="mt-3 max-w-[54ch] text-16 leading-[1.75] text-ink-soft">
          만들면서 배운 것, 부수면서 알게 된 것, 다시 만들면서 달라진 생각을 모았습니다.
        </p>
      </header>

      <div class="pb-8">
        <div
          class="flex items-center gap-2 overflow-x-auto pb-5 [scrollbar-width:none]"
          aria-label="태그"
        >
          <a class={pillActive} href="/blog">
            전체 <span class="text-xs opacity-60">{posts.length}</span>
          </a>
          <For each={tags.slice(0, 6)}>
            {(tag) => (
              <a class={pill} href={tagHref(tag.tag)}>
                #{tag.tag} <span class="text-xs opacity-60">{tag.count}</span>
              </a>
            )}
          </For>
          <a class={pill} href="/tags">
            태그 전체
          </a>
        </div>

        <Ledger posts={posts} />
      </div>
    </>
  );
}
