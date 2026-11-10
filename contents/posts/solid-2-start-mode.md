---
title: "Solid 2.0의 start 모드로 정적 사이트 만들기"
description: "SolidStart 대신 @solidjs/vite-plugin의 start 모드를 쓰고, 빌드된 SSR 핸들러로 모든 경로를 프리렌더하는 방법."
date: 2026-11-06
tags: [solid, vite, build]
cover: /covers/solid.jpg
series: solid-2
seriesTitle: "Solid 2.0"
seriesOrder: 1
---

Solid 2.0은 SolidStart 2와 다른 길을 갑니다. SolidStart 2는 Solid 1.x 기반이고, Solid 2.0 공식 템플릿은 `@solidjs/vite-plugin`의 **start 모드**를 사용합니다. 이 글에서는 그 모드로 정적 블로그를 만든 과정을 정리합니다.

## start 모드란

`@solidjs/vite-plugin`은 `start: true` 옵션 하나로 Vite 앱에 다음을 붙여줍니다.

- `src/App.tsx`를 감싸는 클라이언트 엔트리
- `src/Document.tsx`를 사용하는 문서 셸
- 개발 서버의 SSR 미들웨어
- 빌드 시 `dist/client`와 `dist/server` 생성

`index.html`도, 직접 작성하는 마운트 파일도 필요 없습니다.

```ts
import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    solid({
      start: { renderMode: "async" },
      ssr: true,
      extensions: [".jsx", ".tsx"],
    }),
  ],
});
```

## 정적 사이트로 만들기

`ssr: true`로 빌드하면 `dist/server/server.js`가 생깁니다. 이 모듈은 `handleRequest(request)`를 export합니다. 빌드가 끝난 뒤 이 핸들러에 경로를 하나씩 요청해서 HTML을 저장하면, 런타임 서버 없이도 완성된 정적 사이트가 됩니다.

```js
import { handleRequest } from "../dist/server/server.js";

for (const route of routes) {
  const response = await handleRequest(new Request(`http://localhost${route}`));
  const html = await response.text();
  // dist/client/<route>/index.html 로 저장
}
```

이때 `renderMode: "async"`가 중요합니다. 기본값인 스트리밍 모드에서는 비동기 경계가 `Loading` 폴백으로 먼저 전송될 수 있기 때문입니다. `async`로 두면 모든 경계가 끝난 뒤 완성된 문서 한 장을 받을 수 있습니다.

## 라우터는 요청 URL을 읽는다

Solid Router 2.0은 서버에서 요청 URL을 자동으로 읽습니다. 그래서 프리렌더 스크립트가 경로를 바꿔가며 호출하기만 하면, 같은 라우터 인스턴스가 해당 페이지를 렌더링합니다.

> 별도의 서버 라우터를 만들거나 라우트 배열을 export할 필요가 없습니다. 하나의 인스턴스가 브라우저와 서버, 정적 생성에서 동일하게 동작합니다.

## 배포

최종적으로 Cloudflare에는 `dist/client`만 올립니다. `dist/server`는 프리렌더에만 쓰고 배포 대상에서 제외합니다.

```bash
npx wrangler pages deploy dist/client
```

다음 글에서는 마크다운을 HTML로 바꾸는 파이프라인을 자세히 다룹니다.
