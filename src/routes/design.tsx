import { For } from "solid-js";
import { site } from "../../site.config";
import Seo from "../components/Seo";

const palette = [
  { token: "--paper", light: "#f4f4f6", dark: "#0e0e10", role: "페이지 바탕" },
  { token: "--surface", light: "#ffffff", dark: "#161618", role: "카드, 시트" },
  { token: "--surface-soft", light: "#f9f9fa", dark: "#1d1d21", role: "입력, 목차, 태그" },
  { token: "--ink-strong", light: "#111111", dark: "#ffffff", role: "제목, 활성 pill" },
  { token: "--ink-soft", light: "#6b7280", dark: "#a1a1aa", role: "본문, 보조 텍스트" },
  { token: "--line", light: "#e5e7eb", dark: "#2a2a2f", role: "테두리, 구분선" },
  { token: "--accent", light: "#1d4ed8", dark: "#8ab4ff", role: "링크, 포커스" },
  { token: "--highlight", light: "#e11d48", dark: "#fb7185", role: "검색 표시" },
];

const spacing = [2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56];
const sizes = [10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64];

const principles = [
  ["사진이 먼저", "글에 표지가 있으면 사진이 먼저 보입니다. 목록은 112×80 썸네일로 시작합니다."],
  ["한 장의 종이", "회색 바탕 위에 흰 시트 하나. 모든 콘텐츠는 둥근 모서리 24px 안에 들어갑니다."],
  ["큰 활자, 짧은 문장", "제목은 800 굵기, 자간은 좁게. 설명은 한두 줄로 끊습니다."],
  ["조용한 움직임", "호버에서 화살표가 4px 이동합니다. 그 이상은 하지 않습니다."],
];

const checks = [
  ["건너뛰기", "모든 페이지 첫 포커스는 본문으로 건너뛰는 링크입니다."],
  ["포커스", ":focus-visible에 2px 파랑 아웃라인을 표시합니다."],
  ["현재 위치", "내비는 aria-current, 목차는 aria-current=true로 표시합니다."],
  ["검색 상태", "결과 수와 로딩은 aria-live=\"polite\"로 안내합니다."],
  ["대비", "본문과 링크는 라이트·다크 모두 WCAG AA를 넘습니다."],
  ["모션", "prefers-reduced-motion이면 애니메이션과 부드러운 스크롤을 끕니다."],
];

const dos = [
  "표지가 있는 글은 항상 같은 비율(112×80)로 자릅니다.",
  "여백은 Tailwind 간격 유틸리티(4px 배수)로만 줍니다.",
  "색은 토큰(bg-surface, text-ink-soft)으로만 씁니다.",
  "새 요소는 기존 카드·필·행 조합에서 시작합니다.",
];

const donts = [
  "13px, 1.3rem 같은 스케일 밖의 값.",
  "세 번째 포인트 컬러, 그라데이션 배경.",
  "그림자 두 겹, 24px이 아닌 시트 모서리.",
  "색만으로 호버와 현재 상태를 구분하는 일.",
];

const breakpoints = [
  ["40rem", "시리즈 이전/다음 글이 2열이 됩니다."],
  ["48rem", "상단 내비가 사라지고 햄버거 드로어가 열립니다."],
  ["64rem", "시트 패딩이 40px로 늘고, 카드 여백이 넓어집니다."],
];

const pillBase =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors";
const pill = `${pillBase} bg-surface-soft text-ink-soft hover:bg-line hover:text-ink-strong`;
const pillActive = `${pillBase} bg-ink-strong text-surface`;

export default function Design() {
  return (
    <>
      <Seo
        title={`디자인 규칙 · ${site.title}`}
        description="이 사이트의 색, 활자, 간격, 컴포넌트, 접근성 규칙을 한 화면에 정리했습니다."
        path="/design"
      />

      <header class="pt-2 pb-8">
        <p class="mb-2 text-xs font-semibold text-ink-soft">design system</p>
        <h1 class="text-balance text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.035em]">
          디자인 규칙
        </h1>
        <p class="mt-3 max-w-[58ch] text-16 leading-[1.75] text-ink-soft">
          토큰과 컴포넌트를 한 화면에 모았습니다. 아래 예시는 실제 페이지에서 쓰는
          Tailwind 유틸리티를 그대로 사용합니다.
        </p>
        <p class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-soft">
          <span>색 {palette.length}</span>
          <span>간격 {spacing.length}</span>
          <span>글자 {sizes.length}</span>
          <span>라이트 · 다크</span>
        </p>
      </header>

      <section class="border-t border-line py-10">
        <p class="mb-2 text-xs font-bold text-highlight">01</p>
        <h2 class="text-28 font-extrabold tracking-[-0.03em]">원칙</h2>
        <p class="mt-2 max-w-[58ch] text-sm leading-[1.75] text-ink-soft">
          결정이 막힐 때 돌아오는 네 문장입니다.
        </p>

        <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <For each={principles}>
            {(item, index) => (
              <article class="rounded-card border border-line bg-surface-soft p-5">
                <p class="mb-2 text-xs font-bold text-highlight">
                  {String(index() + 1).padStart(2, "0")}
                </p>
                <h3 class="mb-2 text-20 font-bold tracking-[-0.02em]">{item[0]}</h3>
                <p class="text-sm leading-[1.7] text-ink-soft">{item[1]}</p>
              </article>
            )}
          </For>
        </div>
      </section>

      <section class="border-t border-line py-10">
        <p class="mb-2 text-xs font-bold text-highlight">02</p>
        <h2 class="text-28 font-extrabold tracking-[-0.03em]">색</h2>
        <p class="mt-2 max-w-[58ch] text-sm leading-[1.75] text-ink-soft">
          무채색 바탕에 파랑 하나. 왼쪽 조각이 라이트, 오른쪽 조각이 다크 값입니다.
        </p>

        <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <For each={palette}>
            {(item) => (
              <article class="rounded-card border border-line p-3">
                <div class="mb-3 grid h-12 grid-cols-2 overflow-hidden rounded-md border border-line" aria-hidden="true">
                  <span style={{ background: item.light }} />
                  <span class="border-l border-line" style={{ background: item.dark }} />
                </div>
                <p class="text-xs font-semibold text-ink-strong">{item.token}</p>
                <p class="mt-1 text-10 leading-[1.6] text-ink-soft">{item.role}</p>
                <p class="mt-1 font-mono text-10 leading-[1.6] text-ink-soft">
                  {item.light} · {item.dark}
                </p>
              </article>
            )}
          </For>
        </div>

        <div class="mt-6 grid gap-2 border-t border-line pt-5 text-sm leading-[1.75] text-ink-soft">
          <p>
            <strong class="text-ink-strong">파랑</strong>은 링크와 포커스에만 씁니다.
          </p>
          <p>
            <strong class="text-ink-strong">빨강</strong>은 검색 하이라이트와 이 화면의
            섹션 번호처럼 표시가 필요한 곳에만 씁니다.
          </p>
          <p>
            나머지는 모두 <code class="rounded-sm bg-surface-soft px-1 font-mono text-xs text-ink-strong">--paper</code>,{" "}
            <code class="rounded-sm bg-surface-soft px-1 font-mono text-xs text-ink-strong">--ink-strong</code>,{" "}
            <code class="rounded-sm bg-surface-soft px-1 font-mono text-xs text-ink-strong">--line</code>
            입니다.
          </p>
        </div>
      </section>

      <section class="border-t border-line py-10">
        <p class="mb-2 text-xs font-bold text-highlight">03</p>
        <h2 class="text-28 font-extrabold tracking-[-0.03em]">간격</h2>
        <p class="mt-2 max-w-[58ch] text-sm leading-[1.75] text-ink-soft">
          4px 배수 스케일을 Tailwind 유틸리티로 씁니다. 막대 길이가 실제 px입니다.
        </p>

        <ul class="mt-6 grid gap-2">
          <For each={spacing}>
            {(value) => (
              <li class="grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] items-center gap-4">
                <span class="font-mono text-10 text-ink-soft">space-{value}</span>
                <span class="flex h-3 items-center bg-[linear-gradient(var(--line),var(--line))_center/100%_1px_no-repeat]">
                  <span class="block h-1.5 bg-ink-strong" style={{ width: `${value}px` }} />
                </span>
                <span class="text-right font-mono text-10 tabular-nums text-ink-soft">{value}px</span>
              </li>
            )}
          </For>
        </ul>
      </section>

      <section class="border-t border-line py-10">
        <p class="mb-2 text-xs font-bold text-highlight">04</p>
        <h2 class="text-28 font-extrabold tracking-[-0.03em]">활자</h2>
        <p class="mt-2 max-w-[58ch] text-sm leading-[1.75] text-ink-soft">
          Inter + Noto Sans KR, 한 서체 계열. 12단계만 씁니다.
        </p>

        <ul class="mt-6 grid gap-3">
          <For each={sizes}>
            {(px) => (
              <li class="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                <span class="leading-[1.15] tracking-[-0.01em]" style={{ "font-size": `var(--text-${px})` }}>
                  공책 Aa
                </span>
                <span class="text-right font-mono text-10 text-ink-soft">
                  text-{px} · {px}px
                </span>
              </li>
            )}
          </For>
        </ul>

        <div class="mt-8 grid gap-4">
          <div class="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <span class="text-12 font-semibold text-ink-soft">제목</span>
            <span class="text-24 font-extrabold tracking-[-0.03em]">700–800</span>
          </div>
          <div class="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <span class="text-12 font-semibold text-ink-soft">본문</span>
            <span class="text-16 text-ink">400 · 1.8</span>
          </div>
          <div class="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <span class="text-12 font-semibold text-ink-soft">메타</span>
            <span class="text-12 text-ink-soft">400–500 · tabular-nums</span>
          </div>
        </div>
      </section>

      <section class="border-t border-line py-10">
        <p class="mb-2 text-xs font-bold text-highlight">05</p>
        <h2 class="text-28 font-extrabold tracking-[-0.03em]">형태</h2>
        <p class="mt-2 max-w-[58ch] text-sm leading-[1.75] text-ink-soft">
          모서리는 세 단계, 그림자는 한 단계만 씁니다.
        </p>

        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <div class="rounded-sheet border border-line bg-surface-soft p-5">
            <p class="text-xs font-semibold">시트 · 24px</p>
            <p class="mt-1 font-mono text-10 text-ink-soft">rounded-sheet</p>
          </div>
          <div class="rounded-card border border-line bg-surface-soft p-5">
            <p class="text-xs font-semibold">카드 · 16px</p>
            <p class="mt-1 font-mono text-10 text-ink-soft">rounded-card</p>
          </div>
          <div class="rounded-thumb border border-line bg-surface-soft p-5">
            <p class="text-xs font-semibold">썸네일 · 12px</p>
            <p class="mt-1 font-mono text-10 text-ink-soft">rounded-thumb</p>
          </div>
        </div>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div class="rounded-card bg-surface p-5 shadow-soft ring-1 ring-line">
            <p class="text-xs font-semibold">shadow-soft</p>
            <p class="mt-1 text-10 text-ink-soft">헤더, 시트</p>
          </div>
          <div class="rounded-card bg-surface p-5 shadow-lift ring-1 ring-line">
            <p class="text-xs font-semibold">shadow-lift</p>
            <p class="mt-1 text-10 text-ink-soft">드로어</p>
          </div>
        </div>
      </section>

      <section class="border-t border-line py-10">
        <p class="mb-2 text-xs font-bold text-highlight">06</p>
        <h2 class="text-28 font-extrabold tracking-[-0.03em]">컴포넌트</h2>
        <p class="mt-2 max-w-[58ch] text-sm leading-[1.75] text-ink-soft">
          실제 유틸리티 조합입니다. 새 화면은 이 조합에서 시작합니다.
        </p>

        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-card border border-line bg-surface-soft p-5">
            <p class="mb-3 text-10 font-semibold uppercase tracking-[0.1em] text-ink-soft">필터</p>
            <div class="flex flex-wrap gap-2">
              <span class={pillActive}>전체</span>
              <span class={pill}>#solid</span>
              <span class={pill}>#design</span>
            </div>
          </div>

          <div class="rounded-card border border-line bg-surface-soft p-5">
            <p class="mb-3 text-10 font-semibold uppercase tracking-[0.1em] text-ink-soft">태그</p>
            <div class="flex flex-wrap gap-1.5">
              <span class="rounded-full bg-surface px-2 py-1 text-xs text-ink-soft">solid</span>
              <span class="rounded-full bg-surface px-2 py-1 text-xs text-ink-soft">vite</span>
              <span class="rounded-full bg-surface px-2 py-1 text-xs text-ink-soft">build</span>
            </div>
          </div>

          <div class="rounded-card border border-line bg-surface-soft p-5 md:col-span-2">
            <p class="mb-3 text-10 font-semibold uppercase tracking-[0.1em] text-ink-soft">목록 행</p>
            <div class="rounded-card bg-surface p-2">
              <div class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-2">
                <span class="block h-20 w-28 shrink-0 overflow-hidden rounded-thumb bg-surface-soft">
                  <img class="size-full object-cover" src="/covers/hero.jpg" alt="" />
                </span>
                <span class="block min-w-0">
                  <span class="mb-0.5 block text-xs font-medium text-ink-soft">2026.11.10</span>
                  <span class="block truncate text-16 font-bold text-ink-strong">공책을 펼치며</span>
                  <span class="mt-0.5 line-clamp-1 text-sm text-ink-soft">
                    블로그를 다시 시작합니다. 첫 글은 이 공책을 어떻게 쓸지에 대한 메모입니다.
                  </span>
                </span>
                <span class="grid size-8 place-items-center text-ink-muted">
                  <svg class="icon size-4" viewBox="0 0 24 24"><path d="M5 12h13M12 5l7 7-7 7" /></svg>
                </span>
              </div>
            </div>
          </div>

          <div class="rounded-card border border-line bg-surface-soft p-5">
            <p class="mb-3 text-10 font-semibold uppercase tracking-[0.1em] text-ink-soft">버튼</p>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-2 rounded-full bg-ink-strong px-5 py-3 text-sm font-semibold text-surface">
                홈으로 <span aria-hidden="true">→</span>
              </span>
              <span class="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium">
                ← 목록으로
              </span>
            </div>
          </div>

          <div class="rounded-card border border-line bg-surface-soft p-5">
            <p class="mb-3 text-10 font-semibold uppercase tracking-[0.1em] text-ink-soft">입력</p>
            <input
              class="w-full rounded-card border border-line bg-surface px-5 py-3 text-16 text-ink placeholder:text-ink-muted focus:border-ink-muted focus:outline-none focus:ring-4 focus:ring-ink-muted/20"
              type="text"
              placeholder="검색어"
            />
          </div>
        </div>
      </section>

      <section class="border-t border-line py-10">
        <p class="mb-2 text-xs font-bold text-highlight">07</p>
        <h2 class="text-28 font-extrabold tracking-[-0.03em]">레이아웃</h2>
        <p class="mt-2 max-w-[58ch] text-sm leading-[1.75] text-ink-soft">
          회색 바탕 위 흰 시트 하나. 본문은 44rem에서 멈춥니다.
        </p>

        <div class="mt-6 rounded-card border border-line bg-surface-soft p-4">
          <div class="mx-auto max-w-[34rem] rounded-card border border-line bg-surface p-4">
            <p class="text-10 text-ink-soft">시트 · rounded-sheet · p-5 / sm:p-10</p>
            <div class="mx-auto mt-4 max-w-[44rem] rounded-card border border-dashed border-ink-muted/50 p-4">
              <p class="text-10 text-ink-soft">본문 · max-w-[44rem] · text-16 / 1.8</p>
            </div>
          </div>
        </div>

        <table class="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th class="border-b border-line pb-3 text-left text-10 font-semibold uppercase tracking-[0.08em] text-ink-soft">
                폭
              </th>
              <th class="border-b border-line pb-3 text-left text-10 font-semibold uppercase tracking-[0.08em] text-ink-soft">
                변화
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={breakpoints}>
              {(item) => (
                <tr>
                  <td class="border-b border-line py-3 pr-4 font-mono text-12 text-ink-strong">{item[0]}</td>
                  <td class="border-b border-line py-3 text-ink-soft">{item[1]}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </section>

      <section class="border-t border-line py-10">
        <p class="mb-2 text-xs font-bold text-highlight">08</p>
        <h2 class="text-28 font-extrabold tracking-[-0.03em]">접근성</h2>
        <p class="mt-2 max-w-[58ch] text-sm leading-[1.75] text-ink-soft">
          새 화면을 만들 때 확인하는 여섯 가지입니다.
        </p>

        <ul class="mt-6 border-t border-line">
          <For each={checks}>
            {(item) => (
              <li class="grid gap-1 border-b border-line py-3 text-sm leading-[1.7] text-ink-soft sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-3">
                <span class="text-12 font-semibold text-ink-strong">{item[0]}</span>
                <span>{item[1]}</span>
              </li>
            )}
          </For>
        </ul>
      </section>

      <section class="border-t border-line py-10 pb-0">
        <p class="mb-2 text-xs font-bold text-highlight">09</p>
        <h2 class="text-28 font-extrabold tracking-[-0.03em]">하는 것과 하지 않는 것</h2>

        <div class="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <p class="mb-3 text-10 font-semibold uppercase tracking-[0.1em] text-ink-soft">하는 것</p>
            <ul class="list-disc pl-5 text-sm leading-[1.8] text-ink-soft">
              <For each={dos}>{(item) => <li>{item}</li>}</For>
            </ul>
          </div>
          <div>
            <p class="mb-3 text-10 font-semibold uppercase tracking-[0.1em] text-ink-soft">하지 않는 것</p>
            <ul class="list-disc pl-5 text-sm leading-[1.8] text-ink-soft marker:text-highlight">
              <For each={donts}>{(item) => <li>{item}</li>}</For>
            </ul>
          </div>
        </div>

        <p class="mt-8 border-t border-line pt-5 text-sm leading-[1.8] text-ink-soft">
          긴 설명은{" "}
          <a class="text-accent underline underline-offset-2" href="/blog/designing-a-reading-site">
            「읽는 사이트를 만드는 법」
          </a>
          에 적어 두었습니다. 규칙이 바뀌면 이 화면과{" "}
          <code class="rounded-sm bg-surface-soft px-1 font-mono text-xs text-ink-strong">
            docs/05_design.md
          </code>
          를 함께 고칩니다.
        </p>
      </section>
    </>
  );
}
