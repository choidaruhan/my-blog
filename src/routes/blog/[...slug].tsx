import { query, type RouteProps } from "@solidjs/router";
import { files } from "virtual:content";
import { createMemo, For, Loading, Show } from "solid-js";
import type { CompiledPost } from "../../types";
import Comments from "../../components/Comments";
import Seo from "../../components/Seo";
import SeriesNav from "../../components/SeriesNav";
import TableOfContents from "../../components/TableOfContents";
import { formatDate, postHref, tagHref } from "../../lib/format";
import { site } from "../../../site.config";

type PostModule = { default: CompiledPost };

const loaders = import.meta.glob<PostModule>("/contents/posts/**/*.md");

const getPost = query(async (slug: string) => {
  const file = files[slug];
  if (!file) return null;
  const loader = loaders[file];
  if (!loader) return null;
  const module = await loader();
  return module.default;
}, "post");

export default function PostPage(props: RouteProps<"/blog/*slug">) {
  const post = createMemo(() => getPost(props.params.slug));

  return (
    <Loading
      fallback={
        <div class="grid min-h-[40vh] place-items-center text-sm text-ink-soft">
          글을 불러오는 중
        </div>
      }
    >
      <Show when={post()} keyed fallback={<MissingPost />}>
        {(value) => <Article post={value} />}
      </Show>
    </Loading>
  );
}

function MissingPost() {
  return (
    <div class="grid place-items-center py-24 text-center">
      <p class="text-64 font-extrabold leading-none tracking-[-0.05em]">404</p>
      <p class="mt-4 mb-6 text-ink-soft">글을 찾지 못했습니다.</p>
      <a
        class="inline-flex items-center gap-2 rounded-full bg-ink-strong px-5 py-3 text-sm font-semibold text-surface transition-opacity hover:opacity-85"
        href="/blog"
      >
        글 목록으로
      </a>
    </div>
  );
}

function Article(props: { post: CompiledPost }) {
  const meta = () => props.post.meta;
  const cover = () => meta().cover;

  return (
    <>
      <Seo
        title={`${meta().title} · ${site.title}`}
        description={meta().description}
        path={postHref(meta().slug)}
        type="article"
        image={cover()}
      />

      <article data-pagefind-body>
        <Show when={cover()}>
          {(src) => (
            <div class="-mx-4 -mt-4 mb-6 sm:mb-8">
              <img
                class="h-[clamp(220px,38vw,420px)] w-full object-cover"
                src={src()}
                alt=""
                loading="eager"
              />
            </div>
          )}
        </Show>

        <header class="mx-auto max-w-[44rem]">
          <p class="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium tabular-nums text-ink-soft">
            <time datetime={meta().date}>{formatDate(meta().date)}</time>
            <span aria-hidden="true">·</span>
            <span>{meta().readingTime}분 읽기</span>
            <Show when={meta().series}>
              {(name) => (
                <>
                  <span aria-hidden="true">·</span>
                  <a
                    class="underline decoration-1 underline-offset-[0.2em] hover:text-accent"
                    href={`/series/${name()}`}
                  >
                    {meta().seriesTitle ?? name()}
                  </a>
                </>
              )}
            </Show>
          </p>

          <h1 class="mb-3 text-balance text-[clamp(1.75rem,4.2vw,2.5rem)] font-extrabold leading-[1.2] tracking-[-0.035em]">
            {meta().title}
          </h1>
          <p class="mb-5 text-16 leading-[1.7] text-ink-soft">{meta().description}</p>

          <Show when={meta().tags.length > 0}>
            <div class="mb-8 flex flex-wrap gap-1.5" data-pagefind-ignore>
              <For each={meta().tags}>
                {(tag) => (
                  <a
                    class="inline-flex items-center rounded-full bg-surface-soft px-3 py-1 text-xs text-ink-soft transition-colors hover:bg-line hover:text-ink-strong"
                    href={tagHref(tag)}
                  >
                    #{tag}
                  </a>
                )}
              </For>
            </div>
          </Show>
        </header>

        <div class="mx-auto max-w-[44rem]">
          <TableOfContents headings={props.post.headings} />

          <div
            class="prose article-prose max-w-none text-16 leading-[1.8]"
            innerHTML={props.post.html}
          />

          <SeriesNav nav={props.post.seriesNav} />

          <div class="mt-10 border-t border-line pt-5">
            <a
              class="inline-flex items-center gap-2 rounded-full bg-surface-soft px-4 py-2.5 text-sm font-medium transition-colors hover:bg-line"
              href="/blog"
            >
              <span aria-hidden="true">←</span> 목록으로 돌아가기
            </a>
          </div>

          <Comments />
        </div>
      </article>
    </>
  );
}
