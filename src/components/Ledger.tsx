import { For, Show } from "solid-js";
import type { PostMeta } from "../types";
import { formatDate, postHref, tagHref } from "../lib/format";

export default function Ledger(props: {
  posts: PostMeta[];
  showDescription?: boolean;
}) {
  return (
    <div class="grid gap-0.5">
      <For each={props.posts}>
        {(post) => (
          <article class="group rounded-card transition-colors hover:bg-surface-soft">
            <a
              class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-card p-2"
              href={postHref(post.slug)}
            >
              <Show when={post.cover}>
                {(src) => (
                  <span class="block h-[4.5rem] w-24 shrink-0 overflow-hidden rounded-thumb bg-surface-soft sm:h-20 sm:w-28">
                    <img
                      class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      src={src()}
                      alt=""
                      loading="lazy"
                      width="112"
                      height="80"
                    />
                  </span>
                )}
              </Show>

              <span class="block min-w-0">
                <time
                  class="mb-0.5 block text-xs font-medium tabular-nums text-ink-soft"
                  datetime={post.date}
                >
                  {formatDate(post.date)}
                </time>
                <span class="line-clamp-2 text-16 font-bold tracking-[-0.01em] text-ink-strong sm:line-clamp-1">
                  {post.title}
                </span>
                <Show when={props.showDescription !== false}>
                  <span class="mt-0.5 line-clamp-2 text-sm leading-[1.6] text-ink-soft max-sm:line-clamp-1">
                    {post.description}
                  </span>
                </Show>
              </span>

              <span
                class="hidden size-8 place-items-center text-ink-muted transition-all group-hover:translate-x-1 group-hover:text-ink-strong sm:grid"
                aria-hidden="true"
              >
                <svg class="icon size-4" viewBox="0 0 24 24">
                  <path d="M5 12h13M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>

            <Show when={post.tags.length > 0}>
              <div class="flex flex-wrap gap-1.5 px-2 pb-2">
                <For each={post.tags}>
                  {(tag) => (
                    <a
                      class="inline-flex items-center rounded-full bg-surface-soft px-2 py-1 text-xs text-ink-soft transition-colors hover:bg-line hover:text-ink-strong group-hover:bg-surface"
                      href={tagHref(tag)}
                    >
                      {tag}
                    </a>
                  )}
                </For>
              </div>
            </Show>
          </article>
        )}
      </For>
    </div>
  );
}
