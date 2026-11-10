export interface Heading {
  id: string;
  text: string;
  depth: number;
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  series?: string;
  seriesTitle?: string;
  seriesOrder?: number;
  draft: boolean;
  cover?: string;
  readingTime: number;
}

export interface PostLink {
  slug: string;
  title: string;
}

export interface SeriesNav {
  name: string;
  title: string;
  prev: PostLink | null;
  next: PostLink | null;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface SeriesInfo {
  name: string;
  title: string;
  description?: string;
  posts: PostMeta[];
}

export interface ContentIndex {
  posts: PostMeta[];
  tags: TagCount[];
  series: SeriesInfo[];
  routes: string[];
  /** slug → Vite glob 키 (`/contents/posts/....md`) */
  files: Record<string, string>;
}

export interface CompiledPost {
  meta: PostMeta;
  html: string;
  headings: Heading[];
  readingTime: number;
  seriesNav: SeriesNav | null;
}
