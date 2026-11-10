import tailwindcss from "@tailwindcss/vite";
import { fileRoutes } from "filesystem-routing/vite";
import { defineConfig } from "vite";
import solid from "@solidjs/vite-plugin";
import { content } from "./plugins/content.ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Solid 2.0의 start 모드. ssr: true로 두면 빌드 시
    // dist/client(정적 자산)와 dist/server(SSR 핸들러)가 함께 생성됩니다.
    // renderMode: "async"는 프리렌더 시 모든 비동기 경계가 끝난 뒤
    // 완성된 HTML 한 장을 쓰게 합니다. 정적 사이트에 필수입니다.
    solid({
      start: {
        renderMode: "async",
      },
      ssr: true,
      diagnostics: true,
      extensions: [".jsx", ".tsx"],
    }),
    fileRoutes({ types: true }),
    content(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 0,
  },
});
