import { onSettled } from "solid-js";
import type { JSX } from "@solidjs/web";
import { iconButton } from "../lib/styles";

/**
 * 헤더의 메뉴/검색이 함께 쓰는 시트 껍데기입니다. 폭, 여백, 닫기 버튼 위치를
 * 한 곳에서 관리해 두 팝업이 서로 달라지지 않게 합니다.
 */
export default function Sheet(props: {
  label: string;
  onClose: () => void;
  /** 입력 필드가 없는 시트(메뉴)에서 닫기 버튼으로 포커스를 옮깁니다. */
  focusClose?: boolean;
  children: JSX.Element;
}) {
  let closeButton: HTMLButtonElement | undefined;

  onSettled(() => {
    if (props.focusClose) closeButton?.focus();
  });

  return (
    <>
      <div
        class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
        onClick={props.onClose}
      />
      <div
        class="fixed inset-x-3 top-3 z-[70] mx-auto flex max-h-[calc(100dvh-1.5rem)] max-w-[34rem] animate-drawer-in flex-col overflow-hidden rounded-sheet border border-line bg-surface p-5 shadow-lift"
        role="dialog"
        aria-modal="true"
        aria-label={props.label}
      >
        <div class="mb-4 flex shrink-0 items-center justify-end">
          <button
            type="button"
            class={iconButton}
            ref={closeButton}
            onClick={props.onClose}
            aria-label="닫기"
          >
            <svg class="icon size-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div class="min-h-0 overflow-y-auto">{props.children}</div>
      </div>
    </>
  );
}
