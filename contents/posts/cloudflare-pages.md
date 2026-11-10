---
title: "Cloudflare Pages에 올리고 검색을 붙이기"
description: "정적 파일만으로 배포하고, Pagefind로 한국어 검색 인덱스를 만드는 과정."
date: 2026-11-04
tags: [cloudflare, deploy, search]
cover: /covers/cloudflare.jpg
series: solid-2
seriesTitle: "Solid 2.0"
seriesOrder: 3
---

프리렌더가 끝나면 `dist/client`에는 완성된 HTML과 정적 자산만 남습니다. 이 디렉터리를 Cloudflare Pages에 올리는 것으로 배포는 끝납니다.

## Pages 설정

| 항목 | 값 |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist/client` |
| Node version | `24` |

Solid 2.0은 Node 22.12 이상을 요구합니다. Cloudflare 빌드 환경에서는 `NODE_VERSION` 환경 변수로 버전을 고정하는 편이 안전합니다.

## 빌드 스크립트

`npm run build`는 세 단계로 나뉩니다.

```json
{
  "scripts": {
    "build": "vite build && node scripts/prerender.mjs && pagefind --site dist/client"
  }
}
```

1. `vite build` — 클라이언트와 SSR 번들 생성
2. `prerender.mjs` — 모든 경로를 HTML로 저장
3. `pagefind` — 완성된 HTML을 스캔해 검색 인덱스 생성

## 한국어 검색

Pagefind는 `<html lang="ko">`를 보고 한국어 인덱스를 선택합니다. 본문에 `data-pagefind-body`를 붙이고, 목차나 댓글처럼 검색 결과에 섞이면 안 되는 영역에는 `data-pagefind-ignore`를 붙입니다.

```html
<article data-pagefind-body>
  ...
</article>

<aside data-pagefind-ignore>...</aside>
```

검색 UI는 `/search` 페이지에서 Pagefind의 JS API를 직접 호출합니다. 인덱스는 빌드 후에만 존재하므로 개발 모드에서는 안내 문구를 대신 보여줍니다.

## 캐시 헤더

해시가 붙은 자산은 오래 캐시해도 됩니다. `public/_headers`에 규칙을 둡니다.

```text
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/pagefind/*
  Cache-Control: public, max-age=86400
```

HTML은 항상 재검증하도록 두는 편이 안전합니다. 글을 고쳤는데 이전 페이지가 남아 있으면 곤란하니까요.

## 마무리

정적 사이트의 장점은 단순함입니다. 서버가 없으니 콜드 스타트도, 런타임 오류도, 예상치 못한 요금도 없습니다. 대신 빌드가 모든 것을 결정합니다. 그래서 빌드 파이프라인을 이해하는 것이 이 사이트를 운영하는 일의 대부분입니다.
