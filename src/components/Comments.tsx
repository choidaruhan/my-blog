import { onSettled, Show } from "solid-js";
import { site } from "../../site.config";

interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  theme: string;
  lang: string;
}

export default function Comments() {
  let container: HTMLDivElement | undefined;

  const giscus = site.giscus as GiscusConfig;
  const configured = Boolean(giscus.repoId && giscus.categoryId);

  onSettled(() => {
    if (!configured || !container) return;

    const isDark = document.documentElement.classList.contains("dark");
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    const attributes: Record<string, string> = {
      "data-repo": giscus.repo,
      "data-repo-id": giscus.repoId,
      "data-category": giscus.category,
      "data-category-id": giscus.categoryId,
      "data-mapping": giscus.mapping,
      "data-strict": "0",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "bottom",
      "data-theme": isDark ? "dark" : "light",
      "data-lang": giscus.lang,
      "data-loading": "lazy",
    };

    for (const [key, value] of Object.entries(attributes)) {
      script.setAttribute(key, value);
    }

    container.appendChild(script);

    const syncTheme = () => {
      const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      if (!iframe?.contentWindow) return;
      const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme } } },
        "https://giscus.app",
      );
    };

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  });

  return (
    <Show when={configured || import.meta.env.DEV}>
      <section class="mt-12 border-t border-line pt-6" aria-label="댓글" data-pagefind-ignore>
        <h2 class="mb-4 text-xs font-bold text-ink-soft">댓글</h2>
        <Show
          when={configured}
          fallback={
            <p class="rounded-card bg-surface-soft p-4 text-sm leading-[1.7] text-ink-soft">
              giscus 설정을 추가하면 이 글에 댓글이 표시됩니다.
            </p>
          }
        >
          <div ref={(element) => (container = element)} />
        </Show>
      </section>
    </Show>
  );
}
