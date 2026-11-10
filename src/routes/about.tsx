import { posts, series, tags } from "virtual:content";
import { site } from "../../site.config";
import Seo from "../components/Seo";

export default function About() {
  return (
    <>
      <Seo
        title={`소개 · ${site.title}`}
        description={`${site.title}을 만드는 사람과 이 사이트에 대한 짧은 소개.`}
        path="/about"
      />

      <div class="mx-auto max-w-[44rem] pb-12 pt-4">
        <header class="text-center">
          <img
            class="mx-auto mb-4 size-24 rounded-full border-4 border-surface object-cover shadow-[0_0_0_1px_var(--line)]"
            src="/covers/about.jpg"
            alt=""
            width="96"
            height="96"
          />
          <h1 class="text-32 font-extrabold tracking-[-0.035em]">소개</h1>
          <p class="mt-2 text-16 leading-[1.7] text-ink-soft">
            만들고, 부수고, 다시 만드는 사람의 공책.
          </p>
        </header>

        <div class="mx-auto mt-8 grid max-w-[24rem] grid-cols-3 border-y border-line py-5">
          <div class="grid justify-items-center gap-0.5 border-l border-line first:border-l-0">
            <strong class="text-24 font-extrabold tracking-[-0.03em]">{posts.length}</strong>
            <span class="text-xs text-ink-soft">글</span>
          </div>
          <div class="grid justify-items-center gap-0.5 border-l border-line">
            <strong class="text-24 font-extrabold tracking-[-0.03em]">{tags.length}</strong>
            <span class="text-xs text-ink-soft">태그</span>
          </div>
          <div class="grid justify-items-center gap-0.5 border-l border-line">
            <strong class="text-24 font-extrabold tracking-[-0.03em]">{series.length}</strong>
            <span class="text-xs text-ink-soft">시리즈</span>
          </div>
        </div>

        <div class="prose article-prose mt-10 max-w-none text-16 leading-[1.8]">
          <p>
            안녕하세요. 이곳은 제가 만들면서 배운 것과 다시 만들면서 달라진 생각을 남기는
            공책입니다. 정돈된 결론보다는 과정에 가까운 기록을 씁니다.
          </p>

          <h2>이 사이트에 대해</h2>
          <p>
            화면은 Solid 2.0과 Tailwind CSS로 만들었습니다. 글은{" "}
            <code>contents/posts</code> 폴더의 마크다운 파일이고, 빌드할 때 HTML, 목차,
            RSS, sitemap, 검색 인덱스가 한 번에 만들어집니다.
          </p>
          <p>
            서버 런타임 없이 Cloudflare Pages에 정적 파일로 배포합니다. 그래서 페이지는
            캐시되고, 글을 커밋하면 몇 분 안에 새 글이 올라갑니다.
          </p>

          <h2>연락</h2>
          <p>
            메일은 <a href={`mailto:${site.email}`}>{site.email}</a>로 보내주세요. 짧은
            질문이나 오타 제보도 환영합니다.
          </p>

          <h2>이 공책의 규칙</h2>
          <ul>
            <li>완성된 글만 올리지 않습니다. 메모와 실패도 함께 남깁니다.</li>
            <li>코드는 가능한 한 실제로 돌아간 것만 적습니다.</li>
            <li>틀린 내용을 발견하면 조용히 고치고, 수정 날짜를 남깁니다.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
