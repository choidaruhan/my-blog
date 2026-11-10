---
title: "읽는 사이트를 만드는 일"
description: "사진과 여백, 큰 활자로 글을 받쳐주는 화면 규칙."
date: 2026-11-02
tags: [design, typography]
cover: /covers/reading.jpg
---

블로그의 화면은 글을 방해하지 않아야 합니다. 그렇다고 아무 특징도 없으면 기억에 남지 않죠. 이 사이트는 **사진과 여백이 구조를 대신하는** 방향으로 정리했습니다.

## 활자

Inter와 Noto Sans KR, 한 계열만 씁니다. 제목은 800 굵기로 크게, 본문은 400으로 16px·1.8. 서체를 두 개로 나누는 대신 굵기와 크기로 위계를 만듭니다.

```css
@theme {
  --font-sans: "Inter", "Noto Sans KR", sans-serif;
  --text-16: 1rem;
  --text-28: 1.75rem;
  --text-40: 2.5rem;
}
```

## 사진

표지가 있는 글은 목록에서 112×80 썸네일로 먼저 보입니다. 상세 화면에서는 시트 폭까지 꽉 차는 표지로 시작하고, 그 아래에 날짜와 제목이 옵니다. 사진이 글의 첫 문장 역할을 합니다.

```html
<span class="h-20 w-28 overflow-hidden rounded-thumb">
  <img class="size-full object-cover" src="/covers/hero.jpg" alt="" />
</span>
```

## 여백

회색 바탕 위에 흰 시트 하나를 올립니다. 시트는 24px 모서리에 얇은 테두리와 그림자 한 겹. 본문은 44rem에서 멈추고, 나머지는 비워 둡니다.

```html
<div class="rounded-sheet border border-line bg-surface p-5 shadow-soft sm:p-10">
  <div class="mx-auto max-w-[44rem]">...</div>
</div>
```

모바일에서는 시트 패딩이 20px로 줄고, 상단 내비가 햄버거 드로어로 바뀝니다.

## 색

바탕과 글자는 무채색, 포인트는 두 개만 씁니다. 파랑은 링크와 포커스, 빨강은 검색 결과 표시입니다.

- 바탕 `#f4f4f6`
- 카드 `#ffffff`
- 제목 `#111111`
- 파랑 `#1d4ed8`
- 빨강 `#e11d48`

## 움직임

페이지를 열 때 히어로의 제목과 버튼이 아주 짧게 떠오릅니다. 목록에서는 마우스를 올리면 화살표가 4px 움직이고, 썸네일이 살짝 확대됩니다. 그 이상은 하지 않습니다. `prefers-reduced-motion`이면 모두 끕니다.

> 좋은 인터페이스는 설명을 필요로 하지 않는다. 다만 읽는 사람이 어디에 있는지는 조용히 알려줘야 한다.

이 정도가 이 사이트의 디자인 규칙입니다. 글을 쓰다 보면 또 바뀌겠지만, 기록해두면 다음에 다시 만들 때 덜 헤매겠죠.
