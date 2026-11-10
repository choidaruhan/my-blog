# 05. 디자인

## 콘셉트

회색 바탕 위에 **흰 종이 한 장**. 사진이 글의 첫 문장이 되고, 활자와 여백이 나머지를 받칩니다. 화면은 앱처럼 가볍고, 읽는 동안에는 조용합니다.

- **사진** — 표지가 있는 글은 목록에서 112×80 썸네일, 상세에서는 시트 폭 전체를 쓰는 표지로 시작합니다.
- **활자** — Inter + Noto Sans KR 한 계열. 제목은 800, 본문은 400.
- **면** — 24px 모서리의 시트, 16px 카드, 12px 썸네일. 그림자는 한 겹만.
- **색** — 무채색 + 파랑(링크·포커스) + 빨강(검색 표시).

## Tailwind CSS 4

스타일은 `src/styles/app.css`의 `@theme` 토큰과 마크업의 유틸리티 클래스로 만듭니다. 컴포넌트별 CSS를 새로 만들지 않고, 기존 유틸리티 조합을 재사용합니다.

```css
@theme inline {
  --color-surface: var(--surface);
  --color-ink-strong: var(--ink-strong);
  --radius-sheet: 1.5rem;
  --shadow-soft: 0 10px 30px rgb(17 17 17 / 0.06);
}
```

- 색: `bg-surface`, `text-ink-soft`, `border-line`
- 모서리: `rounded-sheet`, `rounded-card`, `rounded-thumb`
- 그림자: `shadow-soft`, `shadow-lift`
- 글자: `text-12` ~ `text-64`
- 간격: Tailwind 기본 4px 배수 (`p-5` = 20px, `gap-4` = 16px)

## 색

| 토큰 | 라이트 | 다크 | 용도 |
| --- | --- | --- | --- |
| `--paper` | `#f4f4f6` | `#0e0e10` | 페이지 바탕 |
| `--surface` | `#ffffff` | `#161618` | 시트, 카드 |
| `--surface-soft` | `#f3f4f6` | `#1f1f23` | 입력, 목차, 태그 |
| `--ink` | `#1a1a1a` | `#ededf0` | 기본 텍스트 |
| `--ink-strong` | `#111111` | `#ffffff` | 제목, 활성 pill, 버튼 |
| `--ink-soft` | `#6b7280` | `#a1a1aa` | 본문, 보조 텍스트 |
| `--ink-muted` | `#9ca3af` | `#71717a` | 아이콘, 비활성 |
| `--line` | `#e5e7eb` | `#2a2a2f` | 테두리, 구분선 |
| `--accent` | `#1d4ed8` | `#8ab4ff` | 링크, 포커스 |
| `--highlight` | `#e11d48` | `#fb7185` | 검색 하이라이트 |

활성 pill과 버튼은 `bg-ink-strong text-surface` 한 조합으로 라이트/다크가 자동으로 뒤집힙니다.

## 활자

| 역할 | 크기 | 굵기 |
| --- | --- | --- |
| 히어로 제목 | `clamp(2rem, 5.2vw, 3.5rem)` | 800 |
| 페이지 제목 | `clamp(2rem, 4.5vw, 3rem)` | 800 |
| 글 제목 | `clamp(1.75rem, 4.2vw, 2.5rem)` | 800 |
| 섹션 제목 | `text-24` | 800 |
| 본문 | `text-16` / 1.8 | 400 |
| 목록 제목 | `text-16` | 700 |
| 목록 설명 | `text-14` | 400 |
| 날짜·태그 | `text-12` | 400–600 |

12단계 스케일만 씁니다. 13px·15px·18px 같은 중간값은 없습니다. `13px, 1.3rem`도 쓰지 않습니다.

## 레이아웃

- 페이지: `max-w-[68rem]`, 좌우 패딩 16–24px
- 시트: `rounded-sheet border border-line bg-surface p-5 shadow-soft sm:p-10`
- 히어로·표지: 시트 패딩만큼 음수 마진을 주어 가장자리까지 채웁니다.
- 본문: `mx-auto max-w-[44rem]`
- 헤더: `sticky top-2`, `rounded-full`, 반투명 배경 + blur

```
┌ 페이지 바탕 (#f4f4f6) ─────────────────────────┐
│  ┌ 헤더 pill ───────────────────────────────┐  │
│  └──────────────────────────────────────────┘  │
│  ┌ 시트 (24px, 흰색) ────────────────────────┐  │
│  │  표지 이미지 (full-bleed)                  │  │
│  │        본문 max-w-[44rem]                 │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

브레이크포인트는 Tailwind 기본값을 씁니다.

| 폭 | 변화 |
| --- | --- |
| `40rem` | 시리즈 이전/다음 2열 |
| `48rem` | 상단 내비 → 햄버거 드로어, 시트 패딩 20px |
| `64rem` | 시트 패딩 40px, 카드 여백 확대 |

## 컴포넌트

| 컴포넌트 | 규칙 |
| --- | --- |
| pill | `rounded-full bg-surface-soft px-4 py-2 text-sm` · 활성은 `bg-ink-strong text-surface` |
| 목록 행 | `grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4 p-2` · hover 시 `bg-surface-soft` |
| 썸네일 | `h-20 w-28 rounded-thumb object-cover` · hover 시 4% 확대 |
| 태그 | `rounded-full bg-surface-soft px-2 py-1 text-xs` |
| 버튼 | 검정 `bg-ink-strong text-surface`, 보조 `bg-surface-soft` |
| 목차 | `rounded-card bg-surface-soft p-5` |
| 입력 | `rounded-card border border-line bg-surface-soft px-5 py-4` |

새 요소는 위 조합에서 시작하고, 새 클래스를 만들기 전에 기존 유틸리티로 표현할 수 있는지 먼저 확인합니다.

## 다크 모드

- 시스템 설정이 기본, 헤더 토글이 `localStorage`에 저장합니다.
- 색은 모두 CSS 변수라 유틸리티 클래스가 그대로 뒤집힙니다.
- 첫 페인트 전에 `src/Document.tsx`의 인라인 스크립트가 `.dark`를 결정합니다.
- giscus iframe에는 `postMessage`로 테마를 전달합니다.

## 코드 블록

Shiki가 라이트/다크 테마를 동시에 출력하고, CSS 변수로 전환합니다.

```css
.article-prose .shiki span {
  color: var(--shiki-light);
}

.dark .article-prose .shiki span {
  color: var(--shiki-dark) !important;
}
```

배경은 Shiki 테마가 아니라 `--surface-soft`를 쓰고, 모서리는 `rounded-card`입니다.

## 움직임

- 히어로 제목과 버튼이 520ms 동안 10px 떠오릅니다. 페이지당 한 번.
- 목록 hover: 화살표 4px 이동, 썸네일 4% 확대, 배경색 변화.
- 드로어: 220ms 페이드 + 8px 슬라이드.
- `prefers-reduced-motion: reduce`에서는 애니메이션과 부드러운 스크롤을 끕니다.

## 접근성

- 모든 페이지에 본문 바로가기 링크(`skip-link`)가 있습니다.
- `:focus-visible`에 2px 파랑 아웃라인을 표시합니다.
- 내비는 `aria-current="page"`, 목차는 `aria-current="true"`를 씁니다.
- 드로어는 `role="dialog"`, `aria-modal`, Esc 닫기, 열 때 닫기 버튼 포커스를 지원합니다.
- 검색 상태는 `aria-live="polite"`로 안내합니다.
- 색 대비는 `--ink-soft` / `--surface` 기준으로 WCAG AA를 넘깁니다.

## 수정 가이드

| 바꾸고 싶은 것 | 위치 |
| --- | --- |
| 사이트 이름/설명 | `site.config.ts` |
| 색·모서리·그림자 | `src/styles/app.css`의 `@theme`, `:root`, `.dark` |
| 폰트 | `src/Document.tsx`의 `<link>`, `app.css`의 `--font-sans` |
| 표지 이미지 | `public/covers/`, 글 frontmatter의 `cover` |
| 본문 폭 | 글 라우트의 `max-w-[44rem]` |
| 목록 행 | `src/components/Ledger.tsx` |
| 규칙 화면 | `src/routes/design.tsx` |
