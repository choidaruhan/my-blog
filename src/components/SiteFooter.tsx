import { site } from "../../site.config";

export default function SiteFooter() {
  return (
    <footer class="pb-10 pt-4">
      <div class="mx-auto flex w-full max-w-[68rem] flex-col items-center justify-center gap-2 px-2 text-center text-xs text-ink-soft sm:flex-row sm:gap-4">
        <p>
          © {new Date().getFullYear()} {site.author}
        </p>
      </div>
    </footer>
  );
}
