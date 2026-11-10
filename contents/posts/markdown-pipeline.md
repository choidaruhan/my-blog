---
title: "빌드 타임 마크다운 파이프라인"
description: "contents/ 폴더의 마크다운을 HTML, TOC, 검색 인덱스로 바꾸는 Vite 플러그인의 구조."
date: 2026-11-05
tags: [solid, markdown, build]
cover: /covers/pipeline.jpg
series: solid-2
seriesTitle: "Solid 2.0"
seriesOrder: 2
---

블로그의 원본은 `contents/posts` 폴더의 마크다운 파일입니다. 빌드할 때 이 파일들이 JS 모듈로 변환되고, 그 결과가 라우트 컴포넌트에 전달됩니다.

## 변환이 끝난 모듈의 모양

```ts
export const meta = {
  slug: "markdown-pipeline",
  title: "빌드 타임 마크다운 파이프라인",
  date: "2026-11-05",
  tags: ["solid", "markdown", "build"],
  readingTime: 4,
};

export const html = "<h2 id=\"변환이-끝난-모듈의-모양\">...</h2>";
export const headings = [{ id: "변환이-끝난-모듈의-모양", text: "변환이 끝난 모듈의 모양", depth: 2 }];
```

컴포넌트는 이 `html`을 그대로 렌더링합니다.

```tsx
<div innerHTML={post.html} />
```

## unified 파이프라인

마크다운 처리는 `unified` 생태계를 그대로 사용합니다.

1. `remark-parse`로 파싱
2. `remark-gfm`으로 표, 체크리스트, 자동 링크 지원
3. `remark-rehype`로 HTML 트리 변환
4. `rehype-raw`로 마크다운 안의 HTML 허용
5. `rehype-slug`로 헤딩 id 부여
6. `rehype-autolink-headings`로 헤딩 링크 추가
7. `@shikijs/rehype`로 코드 하이라이팅
8. `rehype-stringify`로 문자열 출력

이 모든 과정이 **빌드 타임**에 일어나므로 브라우저에는 마크다운 파서도, Shiki도 포함되지 않습니다.

## 코드 하이라이팅

라이트/다크 테마를 동시에 출력하려면 Shiki의 `defaultColor`를 끕니다.

```ts
.use(rehypeShiki, {
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
  defaultColor: false,
})
```

그러면 각 토큰에 `--shiki-light`, `--shiki-dark` 변수가 붙고, CSS에서 `.dark` 여부에 따라 골라 쓸 수 있습니다.

```css
.shiki span {
  color: var(--shiki-light);
}

.dark .shiki span {
  color: var(--shiki-dark) !important;
}
```

## 목차와 읽는 시간

헤딩은 `github-slugger`로 id를 만들고, 같은 slugger를 TOC 생성에도 사용합니다. 읽는 시간은 본문 글자 수와 단어 수를 함께 계산해 한국어와 영문이 섞여도 어색하지 않게 맞춥니다.

| 항목 | 기준 |
| --- | --- |
| 영문 | 분당 220단어 |
| 한국어 | 분당 500자 |

두 값 중 큰 쪽을 올림해서 표시합니다.

## 폴더가 곧 인덱스

파일을 추가하면 별도의 설정 없이 목록, 태그, 시리즈, 프리렌더 경로까지 자동으로 갱신됩니다. 빌드가 실패하면 어떤 파일의 어떤 필드가 잘못됐는지 바로 알려줍니다.

```bash
[content] contents/posts/foo.md의 frontmatter가 올바르지 않습니다:
  date: Invalid input
```
