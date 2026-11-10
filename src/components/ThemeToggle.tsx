import { createSignal, onSettled } from "solid-js";

export default function ThemeToggle() {
  const [dark, setDark] = createSignal(false);

  onSettled(() => {
    setDark(document.documentElement.classList.contains("dark"));
  });

  const toggle = () => {
    const next = !dark();
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // 저장소를 쓸 수 없어도 테마 전환은 계속 동작합니다.
    }
  };

  return (
    <button
      type="button"
      class="grid size-10 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink-strong"
      onClick={toggle}
      aria-label="색상 테마 전환"
      title="색상 테마 전환"
    >
      <svg class="icon size-5 dark:hidden" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3" />
      </svg>
      <svg class="icon hidden size-5 dark:block" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.2 14.6A8.5 8.5 0 0 1 9.4 3.8a8.5 8.5 0 1 0 10.8 10.8Z" />
      </svg>
    </button>
  );
}
