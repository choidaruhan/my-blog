import type { ParentProps } from "solid-js";
import { HydrationScript } from "@solidjs/web";
import { site } from "../site.config";

// 첫 페인트 전에 테마 클래스를 결정해 깜빡임(FOUC)을 막습니다.
const themeScript = `try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}`;

export default function Document(props: ParentProps) {
  return (
    <html lang={site.lang}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#f4f4f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0e0e10" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap"
        />

        <title>{site.title}</title>
        <meta name="description" content={site.description} />
        <script innerHTML={themeScript} />
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
