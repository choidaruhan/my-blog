export const site = {
  /** 사이트 제목. 헤더 워드마크와 기본 <title>에 사용됩니다. */
  title: "최다루한의 블로그",
  /** 예비 영문 라벨. 현재 화면에는 표시하지 않습니다. */
  label: "choi's notebook",
  /** 기본 설명. OG 태그와 RSS 채널 설명에 사용됩니다. */
  description: "만들고, 부수고, 다시 만드는 기록.",
  /** 배포 후 실제 URL. RSS와 sitemap의 절대 경로 기준입니다. */
  url: "https://blog-ac3.pages.dev",
  lang: "ko",
  author: "Choi Daruhan",
  email: "hello@example.com",
  /** OG 이미지 기본값 (public 기준 경로). */
  ogImage: "/og-default.png",
  /** giscus 댓글 설정. GitHub Discussions 기반입니다. */
  giscus: {
    repo: "choidaruhan/my-blog",
    repoId: "",
    category: "Comments",
    categoryId: "",
    mapping: "pathname",
    theme: "preferred_color_scheme",
    lang: "ko",
  },
} as const;

export type SiteConfig = typeof site;
