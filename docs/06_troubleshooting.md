# 06. 문제 해결

## Node 버전

Solid 2.0은 Node 22.12 이상이 필요합니다.

```bash
node -v
```

`v26.x`에서 개발했고, Cloudflare 빌드 환경에는 `NODE_VERSION=24`를 권장합니다.

---

## Solid 2.0에서 자주 하는 실수

Solid 2.0은 1.x와 API가 다릅니다. React/Solid 1.x 습관이 가장 큰 버그 원인입니다.

| 1.x / React 습관 | Solid 2.0 |
| --- | --- |
| `onMount(fn)` | `onSettled(() => { ...; return cleanup })` |
| `<Suspense>` | `<Loading fallback={...}>` |
| `<ErrorBoundary>` | `<Errored fallback={(err, reset) => ...}>` |
| `createResource` | `createMemo(() => fetch...)` + `<Loading>` |
| `createEffect(() => { sideEffect() })` | `createEffect(() => dep(), value => sideEffect(value))` |
| `classList={{ active: x() }}` | `class={{ active: x() }}` 또는 `class={["base", { active: x() }]}` |
| `dateTime="..."` | `datetime="..."` (소문자) |
| `solid-js/store` | `solid-js` |
| `solid-js/web` | `@solidjs/web` |
| `props` 구조 분해 | `props.x`로 읽기 |
| `<Index each={...}>` | `<For each={...} keyed={false}>` |
| `createAsync` (라우터) | `createMemo` + `<Loading>` |

특히 **props 구조 분해**와 **접근자 전달**을 주의하세요.

```tsx
// ❌ 반응성 없음
function Card({ title }) {
  return <h2>{title}</h2>;
}

// ✅
function Card(props) {
  return <h2>{props.title}</h2>;
}

// ❌ 함수를 그대로 전달
<Card title={title} />

// ✅ JSX 경계에서 호출
<Card title={title()} />
```

---

## 글이 목록에 안 보임

1. 파일이 `contents/posts` 아래에 있는가
2. 확장자가 `.md`인가
3. `draft: true`인가
4. `date`가 미래인가
5. 개발 서버를 재시작해 보기

빌드에서는 `draft`와 미래 날짜가 제외됩니다. 개발 모드에서는 모두 보입니다.

---

## 새 파일을 추가했는데 dev에서 안 보임

플러그인이 `contents/`의 `add`/`unlink`를 감지해 모듈 그래프를 무효화하고 새로고침합니다. 그래도 안 되면 dev 서버를 재시작하세요.

```bash
# Ctrl+C
npm run dev
```

---

## 빌드 실패: frontmatter

예시:

```
[content] contents/posts/foo.md의 frontmatter가 올바르지 않습니다:
  date: Invalid input
```

- `title`, `description`, `date`가 모두 있는지
- `date`가 `YYYY-MM-DD` 형식인지
- `tags`가 배열인지 (`tags: solid` ❌, `tags: [solid]` ✅)
- `seriesOrder`가 양의 정수인지

---

## `file-routes.d.ts`가 없음

`fileRoutes({ types: true })`가 dev/build 시작 시 생성합니다. 파일이 없으면 한 번 실행하세요.

```bash
npm run dev
# 또는
npm run build
```

TypeScript가 계속 `virtual:file-routes`를 못 찾으면 `src/vite-env.d.ts`의 참조를 확인하세요.

```ts
/// <reference types="../file-routes.d.ts" />
```

---

## `handleRequest`를 찾을 수 없음

`scripts/prerender.mjs`는 `dist/server/server.js`의 named export를 사용합니다. `vite build`가 `ssr: true`로 실행됐는지 확인하세요.

```ts
solid({ start: { renderMode: "async" }, ssr: true })
```

`dist/server/server.js`가 없으면 SSR 빌드가 실패한 것입니다. `vite build` 로그를 확인하세요.

---

## 프리렌더 HTML에 "불러오는 중"만 보임

`renderMode`가 `"stream"`이면 `<Loading>` 폴백이 HTML에 남을 수 있습니다.

```ts
solid({
  start: { renderMode: "async" },
  ssr: true,
})
```

으로 설정하세요.

---

## 검색이 개발 모드에서 안 됨

정상입니다. Pagefind 인덱스는 빌드 마지막 단계에서만 생성됩니다.

```bash
npm run build
npm run preview
```

`/search`에서 확인하세요.

배포 후에도 안 되면 `/pagefind/pagefind.js`가 200인지 확인합니다.

```bash
curl -I https://your-domain.com/pagefind/pagefind.js
```

---

## 검색 결과에 목차/댓글이 섞임

`data-pagefind-ignore`를 확인하세요.

```html
<nav data-pagefind-ignore>...</nav>
<section data-pagefind-ignore>...</section>
```

`data-pagefind-body`는 본문 `<article>`에만 붙어 있어야 합니다. 여러 곳에 붙이면 Pagefind가 경고합니다.

---

## 댓글이 안 보임

1. `site.config.ts`의 `giscus.repoId`, `categoryId`가 비어 있지 않은가
2. 저장소에서 Discussions가 활성화되어 있는가
3. giscus.app에서 만든 `category` 이름이 실제와 같은가
4. 광고 차단기가 `giscus.app`을 막고 있지 않은가

설정이 비어 있으면 프로덕션에서는 댓글 영역 자체를 렌더링하지 않습니다. 개발 모드에서는 안내 문구가 보입니다.

---

## 다크 모드가 깜빡임

`src/Document.tsx`의 인라인 테마 스크립트가 `<head>` 안에서 `HydrationScript`보다 먼저 실행되어야 합니다. 순서를 바꾸지 마세요.

또한 `localStorage` 접근은 try/catch로 감싸야 사파리 프라이빗 모드에서 오류가 나지 않습니다.

---

## 태그/시리즈 URL이 깨짐

태그와 시리즈는 URL의 일부가 됩니다. 공백, 대문자, 한글을 피하세요.

```yaml
# ❌
tags: ["Solid 2.0"]

# ✅
tags: [solid]
series: solid-2
seriesTitle: "Solid 2.0"
```

slug 규칙과 동일하게 `소문자 영문, 숫자, -, _, /`만 사용합니다.

---

## Cloudflare에서 404가 뜸

- Output directory가 `dist/client`인지 확인
- `dist/client/index.html`이 실제로 있는지 확인
- `dist/client/blog/<slug>/index.html`이 생성됐는지 확인
- SPA fallback이 아니라 정적 파일 서빙이어야 합니다. Pages는 별도 설정 없이 `index.html`과 `404.html`을 사용합니다.

---

## 폰트가 안 뜸

CDN(jsDelivr, Google Fonts)이 차단된 환경이거나 CSP가 있는 경우입니다. `src/Document.tsx`의 `<link>`를 확인하고, 필요하면 폰트를 `public/fonts`에 직접 호스팅하세요.

---

## 패키지 업그레이드

Solid 2.0 관련 패키지는 RC/next입니다. 업그레이드 후에는 반드시:

```bash
npm run typecheck
npm run build
```

를 실행하고, `@solidjs/vite-plugin`의 changelog에서 `start` 모드 옵션 변경을 확인하세요.

현재 고정 버전:

```json
{
  "solid-js": "2.0.0-rc.21",
  "@solidjs/web": "2.0.0-rc.21",
  "@solidjs/router": "2.0.0-next.44",
  "@solidjs/meta": "1.0.0-next.2",
  "@solidjs/vite-plugin": "3.0.0-next.57"
}
```

`package-lock.json`을 함께 커밋해 재현 가능한 빌드를 유지하세요.
