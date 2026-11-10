export interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: Record<string, string | undefined>;
}

export interface PagefindModule {
  init(): Promise<void>;
  search(query: string): Promise<{
    results: { data(): Promise<PagefindResultData> }[];
  }>;
}

let pending: Promise<PagefindModule> | null = null;

/**
 * Pagefind 인덱스는 빌드 후에만 존재하므로 Vite가 정적으로 해석하지 않도록
 * 런타임 import를 사용합니다. 개발 모드에서는 호출하지 않습니다.
 */
export function loadPagefind(): Promise<PagefindModule> {
  if (!pending) {
    const importer = new Function(
      "return import('/pagefind/pagefind.js')",
    ) as () => Promise<PagefindModule>;
    pending = importer();
  }
  return pending;
}
