# 00. 개요

## 무엇인가

`contents/posts` 폴더에 마크다운 파일을 넣고 빌드하면, 다음이 자동으로 만들어지는 개인 블로그입니다.

- 각 글의 정적 HTML 페이지
- 글 목록, 태그, 시리즈 페이지
- 이전 글/다음 글 네비게이션
- 목차(TOC)와 읽는 시간
- RSS, sitemap, robots.txt
- Pagefind 검색 인덱스
- 다크 모드

서버 런타임은 필요 없습니다. 결과물인 `dist/client`를 Cloudflare Pages에 올리면 끝입니다.

## 왜 이 구조인가

블로그 글은 요청마다 내용이 바뀌지 않습니다. 그래서 **빌드 타임에 모든 것을 정적 파일로 만드는 것**이 가장 빠르고, 저렴하고, 디버깅하기 쉽습니다.

```
마크다운 작성 → 빌드 → 정적 HTML + 검색 인덱스 → CDN 배포
```

빌드 타임에 마크다운을 HTML로 변환하므로 브라우저에는 마크다운 파서도, Shiki(코드 하이라이팅)도 포함되지 않습니다.

## 스택

| 역할 | 선택 | 버전 |
| --- | --- | --- |
| UI 런타임 | Solid 2.0 (RC) | `solid-js@2.0.0-rc.21` |
| 빌드 | Vite | `vite@8.3.6` |
| Solid 통합 | `@solidjs/vite-plugin` start 모드 | `3.0.0-next.57` |
| 라우터 | `@solidjs/router` | `2.0.0-next.44` |
| 헤드 | `@solidjs/meta` | `1.0.0-next.2` |
| 스타일 | Tailwind CSS | `4.3.5` |
| 마크다운 | unified + remark + rehype + Shiki | - |
| 검색 | Pagefind | `1.6.0` |
| 배포 | Cloudflare Pages | - |

> Solid 2.0과 관련 패키지는 아직 RC/next 버전입니다. `package.json`에서 정확한 버전을 고정하고 `package-lock.json`을 함께 커밋하세요.

## SolidStart를 쓰지 않은 이유

SolidStart 2는 **Solid 1.x 기반**입니다. Solid 2.0 공식 템플릿은 SolidStart 대신 `@solidjs/vite-plugin`의 **start 모드**를 사용합니다.

이 프로젝트도 같은 방향을 따릅니다.

- 개발: `vite` 하나로 SSR 포함 개발 서버 실행
- 빌드: `dist/client`(정적 자산) + `dist/server`(SSR 핸들러) 생성
- 배포: `dist/server`는 프리렌더에만 쓰고, `dist/client`만 Cloudflare에 업로드

`vite.config.ts`의 핵심 설정은 두 줄입니다.

```ts
solid({
  start: { renderMode: "async" },
  ssr: true,
});
```

- `ssr: true` — 빌드 시 SSR 핸들러를 함께 만듭니다.
- `renderMode: "async"` — 모든 비동기 경계가 끝난 뒤 완성된 HTML을 씁니다. 정적 프리렌더에 필수입니다.

## 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (초안 포함) |
| `npm run build` | HTML + RSS + sitemap + 검색 인덱스 생성 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run typecheck` | TypeScript 검사 |
| `npm run deploy` | Cloudflare Pages에 배포 |

## 설계 원칙

1. **폴더가 곧 인덱스** — 파일을 추가하면 목록, 태그, 시리즈, 프리렌더 경로가 자동으로 갱신됩니다.
2. **빌드가 실패하면 바로 알린다** — frontmatter 오류는 파일 경로와 필드 이름을 포함해 빌드를 중단합니다.
3. **클라이언트 번들을 가볍게** — 마크다운 파서와 하이라이터는 빌드 타임에만 존재합니다.
4. **정적 우선** — 런타임 서버, 데이터베이스, 콜드 스타트가 없습니다.
5. **한국어 우선** — `word-break: keep-all`, 한국어 검색 인덱스, 한국어 날짜 포맷.
