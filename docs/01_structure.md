# 01. 프로젝트 구조

## 전체 구조

```
my-blog/
├─ contents/
│  └─ posts/                     # 글 원본 (.md)
│     ├─ hello-notebook.md
│     └─ solid-2/
│        └─ router.md            # slug: solid-2/router
├─ public/
│  ├─ favicon.svg
│  ├─ og-default.png             # 기본 OG 이미지
│  ├─ covers/                    # 글 표지 이미지
│  └─ _headers                   # Cloudflare 캐시 헤더
├─ scripts/
│  └─ prerender.mjs              # 모든 경로를 HTML로 저장 + RSS/sitemap
├─ src/
│  ├─ app.tsx                    # 라우터와 공통 레이아웃
│  ├─ Document.tsx               # <html>, <head>, 테마 초기화
│  ├─ router.ts                  # createRouter 설정
│  ├─ routes/                    # 파일 기반 라우트
│  │  ├─ index.tsx               # /
│  │  ├─ blog/
│  │  │  ├─ index.tsx            # /blog
│  │  │  └─ [...slug].tsx        # /blog/*
│  │  ├─ tags/
│  │  │  ├─ index.tsx            # /tags
│  │  │  └─ [tag].tsx            # /tags/:tag
│  │  ├─ series/
│  │  │  ├─ index.tsx            # /series
│  │  │  └─ [name].tsx           # /series/:name
│  │  ├─ about.tsx               # /about
│  │  ├─ design.tsx              # /design (UI/UX 규칙)
│  │  ├─ search.tsx              # /search
│  │  └─ [...404].tsx            # 404
│  ├─ components/
│  │  ├─ SiteHeader.tsx
│  │  ├─ SiteFooter.tsx
│  │  ├─ ThemeToggle.tsx
│  │  ├─ Ledger.tsx              # 글 목록 행
│  │  ├─ ArticleMeta.tsx         # 작성일/시리즈/읽는 시간
│  │  ├─ TableOfContents.tsx     # 목차 + 스크롤 하이라이트
│  │  ├─ SeriesNav.tsx           # 이전 글/다음 글
│  │  ├─ Comments.tsx            # giscus
│  │  └─ Seo.tsx                 # title/meta/canonical/OG
│  ├─ lib/
│  │  ├─ content.ts              # (Node) 마크다운 스캔/컴파일
│  │  ├─ format.ts               # 날짜/URL 포맷
│  │  └─ pagefind.ts             # Pagefind 런타임 로더
│  ├─ styles/
│  │  └─ app.css                 # Tailwind 4 + 디자인 토큰
│  ├─ types.ts                   # 공용 타입
│  └─ content.d.ts               # virtual:content, *.md 타입 선언
├─ plugins/
│  └─ content.ts                 # Vite 콘텐츠 플러그인
├─ site.config.ts                # 사이트 이름/URL/giscus 설정
├─ vite.config.ts                # solid start + 파일 라우트 + 콘텐츠 + Tailwind
├─ wrangler.toml                 # Cloudflare Pages 배포 설정
├─ file-routes.d.ts              # 파일 라우트가 자동 생성 (커밋 X)
├─ .content/index.json           # 빌드 인덱스 (커밋 X)
└─ docs/
```

## 데이터 흐름

```
contents/posts/*.md
        │
        │ ① plugins/content.ts
        │    frontmatter(zod) → unified → Shiki
        ▼
┌───────────────────────────────┐
│ .md 모듈                      │
│ { meta, html, headings,       │
│   readingTime, seriesNav }    │
└───────────────────────────────┘
        │
        │ ② virtual:content
        │    { posts, tags, series, routes }
        ▼
src/routes/*  (목록/태그/시리즈/본문)
        │
        │ ③ vite build (ssr: true)
        ▼
dist/client + dist/server
        │
        │ ④ scripts/prerender.mjs
        │    handleRequest()로 각 경로 렌더
        ▼
dist/client/**/index.html
dist/client/{rss.xml,sitemap.xml,robots.txt}
        │
        │ ⑤ pagefind --site dist/client
        ▼
dist/client/pagefind/  (검색 인덱스)
```

## 핵심 파일

### `lib/content.ts`

Node에서 실행되는 콘텐츠 엔진입니다. Vite 플러그인과 프리렌더 스크립트가 같은 규칙을 공유합니다.

- `buildContentIndex()` — 전체 글 스캔, frontmatter 검증, 목록/태그/시리즈/경로 생성
- `compilePostFile()` — 개별 글을 HTML + TOC + 읽는 시간 + 시리즈 네비게이션으로 변환
- `renderPostModule()` / `renderIndexModule()` — Vite가 읽을 JS 모듈 소스 생성

### `plugins/content.ts`

Vite 플러그인입니다.

- `.md` 파일을 JS 모듈로 `load`
- `virtual:content` 가상 모듈 제공
- `.content/index.json` 빌드 산출물 기록
- 개발 중 `contents/` 변경 감지 → 인덱스 갱신 + 전체 새로고침

### `scripts/prerender.mjs`

빌드된 서버 번들을 불러와 경로별 HTML을 만듭니다.

```js
const { handleRequest } = await import("dist/server/server.js");
const response = await handleRequest(new Request("http://localhost/blog/hello"));
```

같은 스크립트에서 RSS, sitemap, robots.txt도 생성합니다.

### `site.config.ts`

사이트의 단일 설정 파일입니다. 제목, 설명, URL, 작성자, OG 이미지, giscus 값을 여기서 바꿉니다.

### `vite.config.ts`

```ts
solid({
  start: { renderMode: "async" },
  ssr: true,
  extensions: [".jsx", ".tsx"],
}),
fileRoutes({ types: true }),
content(),
tailwindcss(),
```

- `fileRoutes()` — `src/routes`를 `virtual:file-routes`로 변환
- `content()` — 마크다운 파이프라인
- `tailwindcss()` — Tailwind 4 Vite 플러그인

## 자동 생성 파일

아래 파일은 커밋하지 않습니다. (`.gitignore`에 포함)

| 파일 | 생성 시점 | 용도 |
| --- | --- | --- |
| `file-routes.d.ts` | dev/build 시작 | 파일 라우트 타입 |
| `.content/index.json` | dev/build 시작 | 프리렌더/RSS가 읽는 인덱스 |
| `dist/` | build | 배포 결과물 |
| `dist/client/pagefind/` | build 마지막 | 검색 인덱스 |
