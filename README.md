# 최다루한의 블로그

마크다운으로 쓰고, 정적 HTML로 배포하는 개인 블로그입니다.

- **Solid 2.0** + Vite 8
- **Tailwind CSS 4**
- **Cloudflare Pages** 정적 배포
- **Pagefind** 한국어 검색
- **giscus** 댓글 (선택)

글은 `contents/posts` 폴더의 `.md` 파일입니다. `npm run build` 한 번이면 HTML, RSS, sitemap, 검색 인덱스가 모두 만들어집니다.

## 시작하기

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 정적 사이트 + 검색 인덱스 생성
npm run preview    # 빌드 결과를 로컬에서 확인
npm run typecheck  # TypeScript 검사
```

## 글 쓰기

`contents/posts/hello.md` 파일을 만들고 frontmatter를 채웁니다.

```yaml
---
title: "첫 글"
description: "한 줄 요약"
date: 2026-11-08
tags: [solid, cloudflare]
series: solid-2
seriesTitle: "Solid 2.0"
seriesOrder: 1
draft: false
---

본문을 마크다운으로 씁니다.
```

파일명이 URL의 slug가 됩니다. 자세한 규칙은 [docs/02_content.md](docs/02_content.md)를 참고하세요.

## 문서

| 문서 | 내용 |
| --- | --- |
| [docs/00_overview.md](docs/00_overview.md) | 무엇을, 왜 이렇게 만들었는지 |
| [docs/01_structure.md](docs/01_structure.md) | 폴더 구조와 파일 역할 |
| [docs/02_content.md](docs/02_content.md) | 마크다운 작성법, frontmatter |
| [docs/03_pipeline.md](docs/03_pipeline.md) | 빌드 파이프라인과 자동화 |
| [docs/04_deploy.md](docs/04_deploy.md) | Cloudflare 배포, giscus 설정 |
| [docs/05_design.md](docs/05_design.md) | 디자인 토큰과 레이아웃 |
| [docs/06_troubleshooting.md](docs/06_troubleshooting.md) | 자주 겪는 문제 |

## 배포

Cloudflare Pages에서 Git 저장소를 연결하고 아래 값을 사용합니다.

- Build command: `npm run build`
- Output directory: `dist/client`
- 환경 변수: `NODE_VERSION=24`

CLI로 배포하려면:

```bash
npm run build
npx wrangler login
npm run deploy
```

자세한 내용은 [docs/04_deploy.md](docs/04_deploy.md)를 참고하세요.
