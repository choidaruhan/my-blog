# 02. 글 작성법

## 위치

글은 `contents/posts` 아래에 둡니다. 하위 폴더를 만들어도 됩니다.

```
contents/posts/
├─ hello.md                 → /blog/hello
├─ solid-2/
│  ├─ start-mode.md         → /blog/solid-2/start-mode
│  └─ markdown.md           → /blog/solid-2/markdown
└─ notes/
   └─ 2026-11.md             → /blog/notes/2026-11
```

확장자는 반드시 `.md`여야 합니다. `.mdx`는 처리하지 않습니다.

## frontmatter

모든 글은 아래 형식으로 시작합니다.

```yaml
---
title: "Solid 2.0의 start 모드"
description: "SolidStart 대신 Vite 플러그인의 start 모드를 쓰는 이유"
date: 2026-11-06
updated: 2026-11-08
tags: [solid, vite, build]
series: solid-2
seriesTitle: "Solid 2.0"
seriesOrder: 1
draft: false
cover: /images/solid-2/cover.png
---
```

### 필드

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `title` | ✅ | 글 제목. HTML `<title>`, 목록, RSS에 사용 |
| `description` | ✅ | 한 줄 요약. 목록, OG 태그, RSS에 사용 |
| `date` | ✅ | 작성일 (`YYYY-MM-DD`). 정렬과 예약 발행 기준 |
| `updated` | | 수정일. 글 상단 메타에 표시 |
| `tags` | | 태그 배열. 각 태그는 URL에 사용됨 |
| `series` | | 시리즈 slug. URL에 사용됨 |
| `seriesTitle` | | 시리즈 표시 이름 (없으면 `series` 사용) |
| `seriesOrder` | | 시리즈 내 순서 (1부터) |
| `draft` | | `true`면 개발에서만 보이고 빌드에서 제외 |
| `cover` | | 대표 이미지 경로 (`public` 기준) |
| `slug` | | URL slug를 직접 지정할 때 사용 |

`title`, `description`, `date`가 없거나 형식이 틀리면 **빌드가 실패**합니다.

## slug 규칙

기본 slug는 파일 경로에서 `.md`를 뗀 값입니다.

- `contents/posts/hello.md` → `hello`
- `contents/posts/solid-2/start-mode.md` → `solid-2/start-mode`

직접 지정하려면:

```yaml
slug: solid-2/start
```

slug는 다음 문자만 허용합니다.

```
소문자 영문, 숫자, -, _, /
```

한글 제목은 그대로 사용할 수 있지만, **slug는 영문으로** 두는 것이 URL과 검색엔진에 안전합니다.

## 태그와 시리즈

태그와 시리즈 이름은 URL의 일부가 되므로 영문 소문자 slug를 권장합니다.

```yaml
tags: [solid, cloudflare, design]
series: solid-2
seriesTitle: "Solid 2.0"
```

- 태그 페이지: `/tags/solid`
- 시리즈 페이지: `/series/solid-2`
- 시리즈 순서는 `seriesOrder` → `date` 순으로 정렬됩니다.
- 같은 시리즈의 이전 글/다음 글 링크가 본문 아래에 자동으로 붙습니다.

## 초안과 예약 발행

```yaml
draft: true
```

- `npm run dev` — 초안이 목록에 보이고 URL로 접근할 수 있습니다.
- `npm run build` — 초안이 목록, 프리렌더, RSS, sitemap에서 모두 제외됩니다.

`date`가 미래인 글도 빌드에서 자동으로 제외됩니다. 날짜가 지나면 다시 빌드할 때 공개됩니다.

## 본문

GFM(GitHub Flavored Markdown)을 지원합니다.

- 제목, 목록, 표, 체크리스트, 취소선
- 코드 블록과 인라인 코드
- 인용문
- 각주는 미지원
- 마크다운 안의 원시 HTML 허용

### 제목과 목차

`h2` ~ `h4`가 목차에 들어갑니다. `h1`은 글 제목이므로 목차에서 제외됩니다.

```markdown
## 큰 섹션

### 작은 섹션

#### 더 작은 섹션
```

헤딩에는 자동으로 `id`가 붙고, 우측에 `#` 링크가 생깁니다. 한글 헤딩도 그대로 id가 됩니다.

### 코드 블록

언어를 지정하면 Shiki로 하이라이팅됩니다.

````markdown
```ts
export function hello(name: string) {
  return `Hello, ${name}`;
}
```
````

지원 언어:

```
ts, tsx, js, jsx, json, jsonc, bash, shell, css, html,
md, mdx, yaml, diff, sql, python, rust, go
```

그 외 언어는 일반 텍스트로 표시됩니다. 라이트/다크 테마가 동시에 생성되고, 사이트 테마에 따라 자동으로 바뀝니다.

### 이미지

이미지는 `public` 폴더에 두고 절대 경로로 참조합니다.

```
public/images/solid-2/diagram.png
```

```markdown
![다이어그램](/images/solid-2/diagram.png)
```

빌드 시 이미지 최적화는 하지 않습니다. 큰 이미지는 미리 압축해 두세요.

### 원시 HTML

다음처럼 HTML을 직접 쓸 수 있습니다.

```html
<figure>
  <img src="/images/example.png" alt="예시" />
  <figcaption>설명</figcaption>
</figure>
```

`<script>` 같은 태그도 막지 않지만, 정적 사이트이므로 신뢰할 수 있는 내용만 넣으세요.

## 읽는 시간

본문의 글자 수와 단어 수를 함께 계산합니다.

- 영문: 분당 220단어
- 한국어: 분당 500자

둘 중 큰 값을 올림해서 표시합니다.

## 미리보기

```bash
npm run dev
```

`contents/`에서 파일을 추가/수정/삭제하면 자동으로 인덱스가 갱신되고 페이지가 새로고침됩니다.

## 자주 하는 실수

| 증상 | 원인 |
| --- | --- |
| 글이 목록에 안 보임 | `draft: true`이거나 `date`가 미래 |
| 빌드 실패: `date: Invalid input` | `date`가 `YYYY-MM-DD` 형식이 아님 |
| 빌드 실패: `title은 비워둘 수 없습니다` | frontmatter에 `title` 누락 |
| URL이 깨짐 | slug에 공백/대문자/한글 사용 |
| 코드 하이라이팅이 안 됨 | 지원하지 않는 언어 (일반 텍스트로 표시됨) |
