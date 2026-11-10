import { createSignal, onSettled, Show } from "solid-js";
import { useLocation } from "@solidjs/router";
import { site } from "../../site.config";
import { iconButton } from "../lib/styles";
import SearchBox from "./SearchBox";
import Sheet from "./Sheet";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/blog", label: "글" },
  { href: "/series", label: "시리즈" },
  { href: "/tags", label: "태그" },
  { href: "/about", label: "소개" },
];

const drawerLinks = [...links, { href: "/design", label: "디자인" }];

const navPill =
  "flex h-8 items-center rounded-full px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink-strong aria-[current=page]:bg-ink-strong aria-[current=page]:text-surface";

const drawerItem =
  "block w-full rounded-card px-4 py-3 text-left text-28 font-extrabold tracking-[-0.03em] text-ink-strong transition-colors hover:bg-surface-soft aria-[current=page]:text-ink-muted";

export default function SiteHeader() {
  const [open, setOpen] = createSignal(false);
  const [searchOpen, setSearchOpen] = createSignal(false);
  const location = useLocation();

  const isActive = (href: string) => {
    const path = location.pathname;
    if (href === "/blog") return path === "/blog" || path.startsWith("/blog/");
    return path === href || path.startsWith(`${href}/`);
  };

  let menuButton: HTMLButtonElement | undefined;
  let searchButton: HTMLButtonElement | undefined;

  const lockScroll = (locked: boolean) => {
    document.body.style.overflow = locked ? "hidden" : "";
  };

  const setDrawer = (next: boolean) => {
    setOpen(next);
    lockScroll(next || searchOpen());
  };

  const setSearch = (next: boolean) => {
    setSearchOpen(next);
    lockScroll(next || open());
  };

  onSettled(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (searchOpen()) {
        closeSearch();
      } else if (open()) {
        setDrawer(false);
        menuButton?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const openDrawer = () => {
    setDrawer(true);
  };

  const closeDrawer = () => {
    setDrawer(false);
    menuButton?.focus();
  };

  const openSearch = () => {
    setDrawer(false);
    setSearch(true);
  };

  const closeSearch = (restoreFocus = true) => {
    setSearch(false);
    if (restoreFocus) searchButton?.focus();
  };

  return (
    <header class="sticky top-2 z-40 mb-3 pt-2 sm:top-3 sm:mb-5 sm:pt-3">
      <div class="mx-auto w-full max-w-[68rem] px-2">
        <div class="flex min-h-14 items-center gap-4 rounded-full border border-line bg-surface/80 py-2 pl-4 pr-2 shadow-soft backdrop-blur-md sm:pl-5">
          <a class="shrink-0 text-xl font-extrabold tracking-[-0.03em] text-ink-strong" href="/">
            {site.title}
          </a>

          <nav class="ml-auto hidden items-center gap-1 md:flex" aria-label="주요">
            {links.map((link) => (
              <a
                href={link.href}
                class={navPill}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div class="ml-auto flex items-center gap-1 md:ml-0">
            <button
              type="button"
              class={iconButton}
              ref={searchButton}
              onClick={openSearch}
              aria-label="검색"
              title="검색"
            >
              <svg class="icon size-5" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7.5" />
                <path d="m20.5 20.5-4.2-4.2" />
              </svg>
            </button>
            <ThemeToggle />
            <button
              type="button"
              class={`${iconButton} md:hidden`}
              ref={menuButton}
              onClick={openDrawer}
              aria-label="메뉴 열기"
              aria-expanded={open() ? "true" : "false"}
            >
              <svg class="icon size-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Show when={open()}>
        <Sheet label="사이트 메뉴" onClose={closeDrawer} focusClose>
          <nav class="grid gap-1 pb-2" aria-label="사이트">
            {drawerLinks.map((link) => (
              <a
                href={link.href}
                class={drawerItem}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={closeDrawer}
              >
                {link.label}
              </a>
            ))}
            <button type="button" class={drawerItem} onClick={openSearch}>
              검색
            </button>
          </nav>
        </Sheet>
      </Show>

      <Show when={searchOpen()}>
        <Sheet label="검색" onClose={() => closeSearch()}>
          <SearchBox autofocus onNavigate={() => closeSearch(false)} />
        </Sheet>
      </Show>
    </header>
  );
}
