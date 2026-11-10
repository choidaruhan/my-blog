import { createSignal, createUniqueId, For, onSettled, Show } from "solid-js";
import {
  loadPagefind,
  type PagefindModule,
  type PagefindResultData,
} from "../lib/pagefind";

type Status = "loading" | "idle" | "dev" | "error";

/**
 * 입력창과 결과 목록을 함께 담당합니다. `/search` 페이지와 헤더의 검색 패널이
 * 같은 컴포넌트를 써서 동작과 문구가 어긋나지 않게 합니다.
 */
export default function SearchBox(props: {
  autofocus?: boolean;
  /** 결과 링크를 눌렀을 때. 패널에서는 닫기 용도로 씁니다. */
  onNavigate?: () => void;
}) {
  const inputId = createUniqueId();
  const [status, setStatus] = createSignal<Status>("loading");
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<PagefindResultData[]>([]);
  const [searched, setSearched] = createSignal(false);

  let pagefind: PagefindModule | null = null;
  let timer: number | undefined;
  let input: HTMLInputElement | undefined;

  onSettled(() => {
    if (props.autofocus) input?.focus();

    if (import.meta.env.DEV) {
      setStatus("dev");
      return;
    }

    void (async () => {
      try {
        pagefind = await loadPagefind();
        await pagefind.init();
        setStatus("idle");
      } catch {
        setStatus("error");
      }
    })();

    return () => window.clearTimeout(timer);
  });

  const run = async (value: string) => {
    const trimmed = value.trim();
    setSearched(trimmed.length > 0);

    if (!pagefind || trimmed.length < 2) {
      setResults([]);
      return;
    }

    setStatus("loading");
    try {
      const found = await pagefind.search(trimmed);
      const data = await Promise.all(
        found.results.slice(0, 12).map((result) => result.data()),
      );
      setResults(data);
      setStatus("idle");
    } catch {
      setResults([]);
      setStatus("error");
    }
  };

  const handleInput = (event: Event) => {
    const value = (event.currentTarget as HTMLInputElement).value;
    setQuery(value);
    window.clearTimeout(timer);
    timer = window.setTimeout(() => void run(value), 160);
  };

  const clear = () => {
    window.clearTimeout(timer);
    setQuery("");
    setResults([]);
    setSearched(false);
    input?.focus();
  };

  return (
    <>
      <label class="sr-only" for={inputId}>
        검색어
      </label>
      <div class="relative">
        <input
          id={inputId}
          ref={input}
          class="w-full rounded-card border border-line bg-surface-soft py-4 pl-5 pr-12 text-16 text-ink transition placeholder:text-ink-muted focus:border-ink-muted focus:outline-none focus:ring-4 focus:ring-ink-muted/20"
          type="search"
          value={query()}
          onInput={handleInput}
          placeholder="예: solid, 마크다운, cloudflare"
          autocomplete="off"
          autofocus={props.autofocus}
        />
        <Show when={query().length > 0}>
          <button
            type="button"
            class="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface hover:text-ink-strong"
            onClick={clear}
            aria-label="검색어 지우기"
            title="검색어 지우기"
          >
            <svg class="icon size-4" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </Show>
      </div>

      <p class="mt-4 text-xs text-ink-soft" aria-live="polite">
        <Show when={status() === "loading"}>찾는 중…</Show>
        <Show when={status() === "idle"}>
          <Show when={searched()} fallback="두 글자 이상 입력하세요.">
            {results().length}개의 결과
          </Show>
        </Show>
      </p>

      <Show when={status() === "dev"}>
        <p class="mt-4 rounded-card bg-surface-soft p-4 text-sm leading-[1.7] text-ink-soft">
          검색 인덱스는 프로덕션 빌드에서 만들어집니다.{" "}
          <code class="font-mono text-xs text-ink-strong">npm run build</code> 후{" "}
          <code class="font-mono text-xs text-ink-strong">npm run preview</code>에서
          확인할 수 있습니다.
        </p>
      </Show>

      <Show when={status() === "error"}>
        <p class="mt-4 rounded-card bg-surface-soft p-4 text-sm leading-[1.7] text-ink-soft">
          검색 인덱스를 불러오지 못했습니다. 빌드 결과물에{" "}
          <code class="font-mono text-xs text-ink-strong">dist/client/pagefind</code>가
          있는지 확인해 주세요.
        </p>
      </Show>

      <Show when={status() === "idle" && searched() && results().length === 0}>
        <p class="mt-4 rounded-card bg-surface-soft p-4 text-sm leading-[1.7] text-ink-soft">
          일치하는 글을 찾지 못했습니다. 다른 단어로 시도해 보세요.
        </p>
      </Show>

      <div class="mt-6 grid gap-2">
        <For each={results()}>
          {(result) => (
            <article class="rounded-card p-4 transition-colors hover:bg-surface-soft">
              <h2 class="text-16 font-bold leading-[1.45] tracking-[-0.01em]">
                <a class="hover:text-accent" href={result.url} onClick={props.onNavigate}>
                  {result.meta.title ?? result.url}
                </a>
              </h2>
              <p
                class="mt-1 text-sm leading-[1.7] text-ink-soft [&_mark]:rounded-sm [&_mark]:bg-highlight/20 [&_mark]:px-0.5 [&_mark]:text-ink-strong"
                innerHTML={result.excerpt}
              />
            </article>
          )}
        </For>
      </div>
    </>
  );
}
