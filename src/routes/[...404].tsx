import { site } from "../../site.config";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <div class="px-4 py-16 sm:py-24">
      <Seo
        title={`찾을 수 없는 페이지 · ${site.title}`}
        description="요청한 페이지를 찾을 수 없습니다."
        path="/404"
        noindex
      />

      <div class="mx-auto flex max-w-[40rem] flex-col-reverse items-center justify-center gap-8 text-center sm:flex-row sm:gap-12 sm:text-left">
        <div class="flex-1">
          <p class="text-[clamp(4rem,12vw,7rem)] font-extrabold leading-none tracking-[-0.05em]">
            404
          </p>
          <p class="mb-6 mt-4 text-16 text-ink-soft">페이지를 찾을 수 없어요.</p>
          <a
            class="inline-flex items-center gap-2 rounded-full bg-ink-strong px-5 py-3 text-sm font-semibold text-surface transition-opacity hover:opacity-85"
            href="/"
          >
            홈으로 돌아가기
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <svg
          class="icon size-40 shrink-0 text-ink-muted [stroke-width:1.1] sm:size-44"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
          <path d="M8 14v.5" />
          <path d="M16 14v.5" />
          <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
        </svg>
      </div>
    </div>
  );
}
