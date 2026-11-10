import { Show } from "solid-js";
import type { SeriesNav as SeriesNavData } from "../types";
import { postHref } from "../lib/format";

export default function SeriesNav(props: { nav: SeriesNavData | null }) {
  return (
    <Show when={props.nav}>
      {(nav) => (
        <nav
          class="mt-12 border-t border-line pt-6"
          aria-label={`${nav().title} 시리즈`}
          data-pagefind-ignore
        >
          <p class="mb-3 text-xs font-bold text-ink-soft">{nav().title} 시리즈</p>
          <div class="grid gap-2 sm:grid-cols-2">
            <Show when={nav().prev}>
              {(prev) => (
                <a
                  class="block rounded-card bg-surface-soft p-4 transition-colors hover:bg-line"
                  href={postHref(prev().slug)}
                >
                  <span class="mb-1 block text-xs text-ink-soft">이전 글</span>
                  <span class="text-sm font-semibold leading-[1.5] text-ink-strong">
                    {prev().title}
                  </span>
                </a>
              )}
            </Show>
            <Show when={nav().next}>
              {(next) => (
                <a
                  class="block rounded-card bg-surface-soft p-4 text-right transition-colors hover:bg-line"
                  href={postHref(next().slug)}
                >
                  <span class="mb-1 block text-xs text-ink-soft">다음 글</span>
                  <span class="text-sm font-semibold leading-[1.5] text-ink-strong">
                    {next().title}
                  </span>
                </a>
              )}
            </Show>
          </div>
        </nav>
      )}
    </Show>
  );
}
