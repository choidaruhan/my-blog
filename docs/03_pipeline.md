# 03. 빌드 파이프라인

## 한 줄 요약

```bash
npm run build
```

이 명령은 세 단계를 순서대로 실행합니다.

```json
{
  "scripts": {
    "build": "vite build && node scripts/prerender.mjs && pagefind --site dist/client"
  }
}
```

1. **Vite 빌드** — 클라이언트 번들 + SSR 핸들러 + 마크다운 컴파일
2. **프리렌더** — 모든 경로를 HTML로 저장, RSS/sitemap 생성
3. **Pagefind** — 완성된 HTML을 스캔해 검색 인덱스 생성

---

## 1단계: Vite 빌드

```bash
vite build
```

`vite.config.ts`의 플러그인 순서가 중요합니다.

```ts
plugins: [
  solid({
    start: { renderMode: "async" },
    ssr: true,
    extensions: [".jsx", ".tsx"],
  }),
  fileRoutes({ types: true }),
  content(),
  tailwindcss(),
]
```

### 클라이언트 빌드

- `src/routes`의 각 라우트가 코드 스플리팅됩니다.
- `import.meta.glob("/contents/posts/**/*.md")`로 글 모듈도 개별 청크가 됩니다.
- 글 HTML은 해당 글의 청크에만 포함됩니다. 목록 페이지에는 메타데이터만 들어갑니다.

### SSR 빌드

- `dist/server/server.js`가 생성됩니다.
- 이 모듈은 `handleRequest(request)`와 Fetchable 형태의 기본 export를 제공합니다.

```js
// named export
import { handleRequest } from "./dist/server/server.js";
const response = await handleRequest(new Request("http://localhost/blog/hello"));
const html = await response.text();

// Fetchable 기본 export
import server from "./dist/server/server.js";
const response2 = await server.fetch(new Request("http://localhost/blog/hello"));
```

### 마크다운 컴파일

`plugins/content.ts`가 `.md` 파일을 `load`할 때 다음을 수행합니다.

1. `gray-matter`로 frontmatter 분리
2. `zod`로 필드 검증 (실패 시 파일 경로와 함께 빌드 중단)
3. `unified` 파이프라인 실행
   - `remark-parse` → `remark-gfm` → `remark-rehype`
   - `rehype-raw` → `rehype-slug` → `rehype-autolink-headings`
   - `@shikijs/rehype` (라이트/다크 테마)
   - `rehype-stringify`
4. 헤딩 추출 (TOC), 읽는 시간 계산
5. 시리즈 이전/다음 글 계산
6. JS 모듈 소스로 반환

```ts
export const meta = { ... };
export const html = "<h2 id=\"...\">...</h2>";
export const headings = [...];
export const readingTime = 2;
export const seriesNav = { ... };
export default { meta, html, headings, readingTime, seriesNav };
```

### `virtual:content`

전체 글의 메타데이터만 담은 가상 모듈입니다.

```ts
import { posts, tags, series, routes } from "virtual:content";
```

- `posts` — 발행된 글, 최신순
- `tags` — `{ tag, count }[]`
- `series` — `{ name, title, posts }[]`
- `routes` — 프리렌더할 경로 목록
- `files` — `slug → /contents/posts/....md` 매핑 (slug를 직접 지정한 경우에도 본문 모듈을 찾기 위함)

본문 HTML은 포함하지 않습니다. 목록 페이지가 가벼워집니다.

### 빌드 산출물 `.content/index.json`

프리렌더 스크립트가 읽는 파일입니다.

```json
{
  "posts": [...],
  "tags": [...],
  "series": [...],
  "routes": ["/", "/blog", "/blog/hello", ...],
  "generatedAt": "2026-11-08T...",
  "site": { "title": "...", "url": "..." }
}
```

### 왜 `renderMode: "async"`인가

기본값 `"stream"`은 `<Loading>` 폴백을 먼저 전송하고 나중에 실제 내용을 스트리밍합니다. 프리렌더에서는 폴백이 HTML에 남을 수 있습니다.

`"async"`는 모든 비동기 경계가 끝난 뒤 완성된 문서 한 장을 반환합니다. 정적 사이트에서는 이쪽이 맞습니다.

---

## 2단계: 프리렌더

```bash
node scripts/prerender.mjs
```

### 동작

```js
const { handleRequest } = await import("dist/server/server.js");

for (const route of routes) {
  const response = await handleRequest(new Request(`http://localhost${route}`));
  const html = await response.text();
  // dist/client/<route>/index.html 로 저장
}
```

### 출력 규칙

| 경로 | 파일 |
| --- | --- |
| `/` | `dist/client/index.html` |
| `/blog` | `dist/client/blog/index.html` |
| `/blog/hello` | `dist/client/blog/hello/index.html` |
| `/tags/solid` | `dist/client/tags/solid/index.html` |
| `/404` | `dist/client/404.html` |

Cloudflare Pages는 `blog/hello/index.html`을 `/blog/hello`로 서빙합니다.

### 함께 생성하는 것

- `dist/client/rss.xml` — 최신 글 RSS
- `dist/client/sitemap.xml` — 전체 URL
- `dist/client/robots.txt` — sitemap 안내

RSS와 sitemap은 Solid 라우트가 아니라 Node 스크립트에서 직접 만듭니다. XML을 렌더링할 필요가 없고, 빌드 결과를 정확히 제어할 수 있습니다.

---

## 3단계: 검색 인덱스

```bash
pagefind --site dist/client
```

Pagefind는 **완성된 HTML을 스캔**해서 정적 검색 인덱스를 만듭니다.

- `<html lang="ko">`를 보고 한국어 인덱스 생성
- `data-pagefind-body`가 있는 페이지만 인덱싱
- `data-pagefind-ignore`가 붙은 요소는 제외

본문 구조:

```html
<article data-pagefind-body>
  <h1>글 제목</h1>
  <p>본문...</p>

  <nav data-pagefind-ignore>시리즈 이전/다음</nav>
  <section data-pagefind-ignore>댓글</section>
</article>
```

목차, 헤딩 앵커, 시리즈 네비게이션, 댓글은 인덱싱하지 않습니다.

결과물은 `dist/client/pagefind/`에 생성됩니다.

---

## 개발 모드

```bash
npm run dev
```

- Vite dev 서버가 `start` 모드의 SSR 미들웨어를 사용합니다.
- `contents/` 변경을 감지해 인덱스를 다시 만들고 페이지를 새로고침합니다.
- 새 파일/삭제는 `import.meta.glob` 결과도 바뀌므로 모듈 그래프를 무효화합니다.
- 초안(`draft: true`)도 이때는 보입니다.

검색 인덱스는 빌드 후에만 존재하므로 개발 모드의 `/search`는 안내 문구를 보여줍니다.

---

## 확장 지점

### 새 계산 필드를 추가하려면

1. `src/types.ts`의 `PostMeta`에 필드 추가
2. `lib/content.ts`의 `toMeta()`에서 계산
3. `src/content.d.ts`는 `src/types.ts`를 참조하므로 자동 반영

### 새 페이지를 추가하려면

`src/routes`에 파일을 만들면 `fileRoutes`가 자동으로 인식합니다. `routes`에 포함되어야 프리렌더되므로, 동적 경로라면 `lib/content.ts`의 `buildRoutes()`에 추가하세요.

### 페이지네이션을 넣으려면

`buildRoutes()`에 `/blog/page/2` 같은 경로를 추가하고, `src/routes/blog/page/[page].tsx`를 만들면 됩니다. 현재는 전체 글을 한 페이지에 보여줍니다.

### RSS에 본문을 넣으려면

프리렌더된 `dist/client/blog/<slug>/index.html`에서 `<article>` 부분을 추출하거나, `lib/content.ts`에서 글 HTML을 별도 파일로 저장한 뒤 스크립트에서 읽으면 됩니다. 현재 RSS는 요약만 포함합니다.
