import { site } from "../../site.config";
import Seo from "../components/Seo";
import SearchBox from "../components/SearchBox";

export default function Search() {
  return (
    <>
      <Seo
        title={`검색 · ${site.title}`}
        description="글 제목과 본문을 검색합니다."
        path="/search"
      />

      <div class="mx-auto max-w-[44rem] pb-12 pt-4">
        <header class="pb-6 pt-2">
          <h1 class="text-balance text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.035em]">
            검색
          </h1>
          <p class="mt-3 text-16 leading-[1.75] text-ink-soft">
            제목과 본문에서 찾습니다.
          </p>
        </header>

        <SearchBox autofocus />
      </div>
    </>
  );
}
