import { createMemo } from "solid-js";
import type { RouteProps } from "@solidjs/router";
import { series } from "virtual:content";
import { site } from "../../../site.config";
import Ledger from "../../components/Ledger";
import Seo from "../../components/Seo";

export default function SeriesPage(props: RouteProps<"/series/:name">) {
  const name = () => props.params.name;
  const item = createMemo(() => series.find((entry) => entry.name === name()));

  return (
    <>
      <Seo
        title={`${item()?.title ?? name()} · ${site.title}`}
        description={`${item()?.title ?? name()} 시리즈.`}
        path={`/series/${name()}`}
      />

      <header class="pt-2 pb-6">
        <p class="mb-2 text-xs font-semibold text-ink-soft">시리즈</p>
        <h1 class="text-balance text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.035em]">
          {item()?.title ?? name()}
        </h1>
        <p class="mt-3 max-w-[54ch] text-16 leading-[1.75] text-ink-soft">
          {item()?.posts.length ?? 0}편의 연재 글. 순서대로 읽으면 흐름이 이어집니다.
        </p>
      </header>

      <div class="pb-8">
        <Ledger posts={item()?.posts ?? []} />
      </div>
    </>
  );
}
