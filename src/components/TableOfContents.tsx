import { createSignal, For, onSettled, Show } from "solid-js";
import type { Heading } from "../types";

export default function TableOfContents(props: { headings: Heading[] }) {
  const [active, setActive] = createSignal<string | null>(null);

  onSettled(() => {
    const elements = props.headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );

    for (const element of elements) observer.observe(element);

    return () => observer.disconnect();
  });

  return (
    <Show when={props.headings.length > 0}>
      <nav class="mb-8 rounded-card bg-surface-soft p-5" aria-label="목차" data-pagefind-ignore>
        <p class="mb-3 text-xs font-bold text-ink-soft">목차</p>
        <ol class="grid gap-1.5">
          <For each={props.headings}>
            {(heading) => (
              <li class={heading.depth >= 3 ? "pl-4" : undefined}>
                <a
                  class={`block py-0.5 text-ink-soft transition-colors hover:text-ink-strong aria-[current=true]:text-ink-strong ${
                    heading.depth >= 3 ? "text-xs" : "text-sm"
                  } leading-[1.5]`}
                  href={`#${heading.id}`}
                  aria-current={active() === heading.id ? "true" : undefined}
                >
                  {heading.text}
                </a>
              </li>
            )}
          </For>
        </ol>
      </nav>
    </Show>
  );
}
