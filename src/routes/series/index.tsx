import { For, Show } from "solid-js";
import { series } from "virtual:content";
import { site } from "../../../site.config";
import { seriesHref } from "../../lib/format";
import Seo from "../../components/Seo";

export default function SeriesIndex() {
  return (
    <>
      <Seo
        title={`시리즈 · ${site.title}`}
        description="순서대로 읽는 연재 글 모음."
        path="/series"
      />

      <header class="pt-2 pb-6">
        <h1 class="text-balance text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.035em]">
          시리즈
        </h1>
        <p class="mt-3 max-w-[54ch] text-16 leading-[1.75] text-ink-soft">
          하나의 주제를 여러 편에 나눠 쓴 글입니다.
        </p>
      </header>

      <div class="grid gap-0.5 pb-8">
        <For each={series}>
          {(item) => (
            <a
              class="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-card p-2 transition-colors hover:bg-surface-soft"
              href={seriesHref(item.name)}
            >
              <Show when={item.posts[0]?.cover}>
                {(src) => (
                  <span class="block h-[4.5rem] w-24 shrink-0 overflow-hidden rounded-thumb bg-surface-soft sm:h-20 sm:w-28">
                    <img
                      class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      src={src()}
                      alt=""
                      loading="lazy"
                      width="112"
                      height="80"
                    />
                  </span>
                )}
              </Show>

              <span class="block min-w-0">
                <span class="mb-0.5 block text-xs font-medium text-ink-soft">
                  시리즈 · {item.posts.length}편
                </span>
                <span class="line-clamp-2 text-16 font-bold tracking-[-0.01em] text-ink-strong sm:line-clamp-1">
                  {item.title}
                </span>
                <span class="mt-0.5 line-clamp-2 text-sm leading-[1.6] text-ink-soft max-sm:line-clamp-1">
                  {item.posts.map((post) => post.title).join(" · ")}
                </span>
              </span>

              <span
                class="hidden size-8 place-items-center text-ink-muted transition-all group-hover:translate-x-1 group-hover:text-ink-strong sm:grid"
                aria-hidden="true"
              >
                <svg class="icon size-4" viewBox="0 0 24 24">
                  <path d="M5 12h13M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          )}
        </For>
      </div>
    </>
  );
}
