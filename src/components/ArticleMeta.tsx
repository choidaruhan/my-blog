import { Show } from "solid-js";
import type { PostMeta } from "../types";
import { formatDateLong, seriesHref } from "../lib/format";

export default function ArticleMeta(props: { meta: PostMeta }) {
  return (
    <div class="article-meta">
      <div>
        <span class="meta-label">작성</span>{" "}
        <span class="meta-strong">{formatDateLong(props.meta.date)}</span>
      </div>

      <Show when={props.meta.updated}>
        {(updated) => (
          <div>
            <span class="meta-label">수정</span>{" "}
            <span class="meta-strong">{formatDateLong(updated())}</span>
          </div>
        )}
      </Show>

      <Show when={props.meta.series}>
        {(name) => (
          <div>
            <span class="meta-label">시리즈</span>{" "}
            <a class="meta-strong" href={seriesHref(name())}>
              {props.meta.seriesTitle ?? name()}
            </a>
          </div>
        )}
      </Show>

      <div>{props.meta.readingTime}분 읽기</div>

      <Show when={props.meta.draft}>
        <div>
          <span class="meta-strong">초안</span>
        </div>
      </Show>
    </div>
  );
}
