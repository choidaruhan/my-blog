# 04. Cloudflare 배포

## 준비

배포 전에 `site.config.ts`를 실제 값으로 바꾸세요.

```ts
export const site = {
  title: "최다루한의 블로그",
  label: "choi's notebook",
  description: "만들고, 부수고, 다시 만드는 기록.",
  url: "https://your-domain.com", // ← 실제 배포 URL
  lang: "ko",
  author: "Choi Daruhan",
  email: "hello@example.com",
  ogImage: "/og-default.png",
  giscus: { ... },
};
```

특히 `url`은 RSS, sitemap, canonical, OG 태그의 기준이므로 정확해야 합니다.

---

## 방법 1: Git 연동 (권장)

1. GitHub/GitLab에 저장소를 만듭니다.
2. Cloudflare 대시보드 → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 저장소를 선택합니다.
4. 빌드 설정을 입력합니다.

| 항목 | 값 |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist/client` |
| Root directory | `/` |
| Node version | `24` |

5. **Environment variables**에 `NODE_VERSION=24`를 추가합니다.
6. Save and Deploy.

이후 `main` 브랜치에 푸시할 때마다 자동 배포됩니다. PR 브랜치는 미리보기 URL이 생깁니다.

### Node 버전

Solid 2.0은 Node 22.12 이상을 요구합니다. Cloudflare Pages의 기본 Node 버전은 시점에 따라 달라질 수 있으므로 `NODE_VERSION=24`를 명시하는 것이 안전합니다.

---

## 방법 2: Wrangler CLI

```bash
npm install
npx wrangler login
npm run build
npm run deploy
```

`wrangler.toml`:

```toml
name = "my-blog"
pages_build_output_dir = "./dist/client"
compatibility_date = "2026-11-08"
```

`name`은 Cloudflare Pages 프로젝트 이름입니다. 처음 배포할 때 프로젝트가 없으면 생성됩니다.

---

## 배포 결과 확인

```bash
curl -I https://your-domain.com/
curl -I https://your-domain.com/blog/hello-notebook
curl https://your-domain.com/rss.xml
curl https://your-domain.com/sitemap.xml
curl https://your-domain.com/robots.txt
```

확인할 것:

- `/`가 200이고 실제 글 목록이 HTML에 있음
- `/blog/<slug>`가 200
- `/rss.xml`, `/sitemap.xml`이 XML로 응답
- `/pagefind/pagefind.js`가 200
- 존재하지 않는 URL이 `404.html`을 반환

---

## 커스텀 도메인

1. Pages 프로젝트 → **Custom domains** → **Set up a custom domain**
2. 도메인을 입력합니다.
3. Cloudflare DNS를 쓰면 자동으로 CNAME이 추가됩니다.
4. `site.config.ts`의 `url`을 커스텀 도메인으로 바꾸고 다시 배포합니다.

---

## 캐시 헤더

`public/_headers`가 빌드 결과의 `dist/client/_headers`로 복사됩니다.

```text
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/pagefind/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800

/*
  Cache-Control: public, max-age=0, must-revalidate
```

- 해시가 붙은 `/assets/*`는 1년 캐시
- 검색 인덱스는 하루 캐시
- HTML은 항상 재검증

글을 수정한 뒤 HTML이 캐시에 남아 있으면 곤란하므로 HTML은 `max-age=0`으로 둡니다.

---

## giscus 댓글 설정

기본 설정은 비어 있어서 프로덕션에서는 댓글 영역이 숨겨집니다. 개발 모드에서는 설정 안내가 보입니다.

1. GitHub 저장소 → **Settings** → **General** → **Features** → **Discussions** 활성화
2. [giscus.app](https://giscus.app)에서 저장소를 입력합니다.
3. `repo`, `repoId`, `category`, `categoryId` 값을 복사합니다.
4. `site.config.ts`에 넣습니다.

```ts
giscus: {
  repo: "choidaruhan/my-blog",
  repoId: "R_kgDO...",
  category: "Comments",
  categoryId: "DIC_kwDO...",
  mapping: "pathname",
  theme: "preferred_color_scheme",
  lang: "ko",
},
```

`mapping: "pathname"`은 글 URL을 기준으로 댓글 스레드를 연결합니다. slug를 바꾸면 기존 댓글과 연결이 끊어지니 주의하세요.

다크 모드 토글은 giscus iframe에 `postMessage`로 전달됩니다.

---

## 사이트맵 제출

배포 후 Google Search Console / Naver Search Advisor에 `https://your-domain.com/sitemap.xml`을 제출합니다. `robots.txt`에도 sitemap 경로가 포함되어 있습니다.

---

## 분석 (선택)

Cloudflare 대시보드 → **Web Analytics**에서 사이트를 추가하고 스크립트를 `src/Document.tsx`의 `<head>`에 넣을 수 있습니다. 쿠키 없는 분석이라 별도 동의 배너가 필요 없습니다.

---

## 배포 체크리스트

- [ ] `site.config.ts`의 `url`이 실제 도메인인가
- [ ] `NODE_VERSION=24`가 설정되어 있는가
- [ ] Build output directory가 `dist/client`인가
- [ ] `/rss.xml`, `/sitemap.xml`, `/pagefind/pagefind.js`가 200인가
- [ ] 404 페이지가 정상 동작하는가
- [ ] giscus를 쓴다면 `repoId`, `categoryId`가 채워져 있는가
- [ ] OG 이미지(`/og-default.png`)가 열리는가
