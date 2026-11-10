import { For, Show } from "solid-js";
import { posts, series, tags } from "virtual:content";
import { site } from "../../site.config";
import Ledger from "../components/Ledger";
import Seo from "../components/Seo";
import { tagHref, seriesHref } from "../lib/format";

const LATEST_COUNT = 6;

const pillBase =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors";
const pill = `${pillBase} bg-surface-soft text-ink-soft hover:bg-line hover:text-ink-strong`;
const pillActive = `${pillBase} bg-ink-strong text-surface`;

export default function Home() {
  const latest = posts.slice(0, LATEST_COUNT);
  const featuredSeries = series[0];
  const topTags = tags.slice(0, 4);

  return (
    <>
      <Seo title={site.title} description={site.description} path="/" />

      <section class="relative -mx-4 -mt-4 mb-8 flex min-h-[68vh] flex-col justify-between overflow-hidden rounded-t-sheet px-6 py-10 text-white sm:mb-10 sm:min-h-[clamp(420px,52vw,560px)] sm:px-10">
        <img class="absolute inset-0 size-full object-cover" src="/covers/hero.jpg" alt="" fetchpriority="high" />
        <div
          class="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.35)_0%,rgba(15,23,42,0.15)_32%,rgba(15,23,42,0.72)_100%)]"
          aria-hidden="true"
        />

        <div class="relative z-10 mt-auto mb-8 max-w-[34rem] motion-safe:animate-rise">
          <h1 class="mb-4 max-w-[10em] text-[clamp(2rem,5.2vw,3.5rem)] font-extrabold leading-[1.12] tracking-[-0.035em] text-balance [text-shadow:0_1px_30px_rgba(15,23,42,0.25)]">
            {site.description}
          </h1>
          <p class="max-w-[46ch] text-16 leading-[1.7] text-white/80">
            Solid, 도구, 그리고 다시 만드는 일에 대한 기록. 글은 마크다운으로 쓰고,
            빌드할 때 정적 페이지와 검색 인덱스가 함께 만들어집니다.
          </p>
        </div>

        <div class="relative z-10 flex items-center justify-between gap-4 motion-safe:animate-rise">
          <a
            class="grid size-12 place-items-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition hover:translate-y-0.5 hover:bg-white/20"
            href="#latest"
            aria-label="최근 글로 이동"
          >
            <svg class="icon size-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
          <a
            class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/[0.16] px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:translate-x-0.5 hover:bg-white/25"
            href="/blog"
          >
            글 둘러보기
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section class="scroll-mt-24 pb-10 pt-2" id="latest">
        <div class="mb-3 flex items-baseline justify-between gap-4">
          <h2 class="text-24 font-extrabold tracking-[-0.03em]">최근 기록</h2>
          <a
            class="shrink-0 text-sm font-medium text-ink-soft transition-colors hover:text-ink-strong"
            href="/blog"
          >
            전체 글
          </a>
        </div>

        <div
          class="flex items-center gap-2 overflow-x-auto pb-5 [scrollbar-width:none]"
          aria-label="태그"
        >
          <a class={pillActive} href="/blog">
            전체
          </a>
          <For each={topTags}>
            {(tag) => (
              <a class={pill} href={tagHref(tag.tag)}>
                #{tag.tag}
              </a>
            )}
          </For>
        </div>

        <Ledger posts={latest} />
      </section>

      <Show when={featuredSeries}>
        {(item) => (
          <section class="border-t border-line pb-10 pt-8" aria-labelledby="series-heading">
            <div class="mb-3 flex items-baseline justify-between gap-4">
              <h2 class="text-24 font-extrabold tracking-[-0.03em]" id="series-heading">
                시리즈 · {item().title}
              </h2>
              <a
                class="shrink-0 text-sm font-medium text-ink-soft transition-colors hover:text-ink-strong"
                href={seriesHref(item().name)}
              >
                시리즈 전체
              </a>
            </div>
            <Ledger posts={item().posts.slice(0, 3)} showDescription={false} />
          </section>
        )}
      </Show>
    </>
  );
}
