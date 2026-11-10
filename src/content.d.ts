declare module "*.md" {
  export const meta: import("./types").PostMeta;
  export const html: string;
  export const headings: import("./types").Heading[];
  export const readingTime: number;
  export const seriesNav: import("./types").SeriesNav | null;

  const post: import("./types").CompiledPost;
  export default post;
}

declare module "virtual:content" {
  export const posts: import("./types").PostMeta[];
  export const tags: import("./types").TagCount[];
  export const series: import("./types").SeriesInfo[];
  export const routes: string[];
  export const files: Record<string, string>;
  export const generatedAt: string;

  const index: {
    posts: import("./types").PostMeta[];
    tags: import("./types").TagCount[];
    series: import("./types").SeriesInfo[];
    routes: string[];
    files: Record<string, string>;
    generatedAt: string;
  };
  export default index;
}
