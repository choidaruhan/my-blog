import { For } from "solid-js";
import { tags } from "virtual:content";
import { site } from "../../../site.config";
import Seo from "../../components/Seo";
import { tagHref } from "../../lib/format";

export default function TagsIndex() {
  return (
    <>
      <Seo
        title={`태그 · ${site.title}`}
        description="주제별로 모아 본 글."
        path="/tags"
      />

      <header class="pt-2 pb-6">
        <h1 class="text-balance text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.035em]">
          태그
        </h1>
        <p class="mt-3 max-w-[54ch] text-16 leading-[1.75] text-ink-soft">
          관심 있는 주제로 글을 골라 읽어보세요.
        </p>
      </header>

      <div class="flex flex-wrap gap-2 pb-8">
        <For each={tags}>
          {(tag) => (
            <a
              class="inline-flex items-center gap-2 rounded-full bg-surface-soft px-5 py-3 text-16 font-medium text-ink-soft transition-colors hover:bg-line hover:text-ink-strong"
              href={tagHref(tag.tag)}
            >
              #{tag.tag}
              <span class="text-xs opacity-60">{tag.count}</span>
            </a>
          )}
        </For>
      </div>
    </>
  );
}
