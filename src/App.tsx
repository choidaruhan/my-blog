import { Loading } from "solid-js";
import { Router } from "./router";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import "./styles/app.css";

export default function App() {
  return (
    <Router>
      {(props) => (
        <div class="site">
          <a
            class="absolute left-4 -top-20 z-[100] rounded-full bg-ink-strong px-5 py-3 text-sm text-surface transition-[top] focus:top-4"
            href="#main"
          >
            본문으로 건너뛰기
          </a>
          <SiteHeader />
          <Loading
            fallback={
              <main
                id="main"
                class="grid min-h-[40vh] place-items-center text-sm text-ink-soft"
                aria-busy="true"
              >
                <span>불러오는 중</span>
              </main>
            }
          >
            <main id="main" class="pb-10">
              <div class="mx-auto w-full max-w-[68rem] px-2">
                <div class="overflow-clip rounded-sheet border border-line bg-surface p-4 shadow-soft">
                  {props.children}
                </div>
              </div>
            </main>
          </Loading>
          <SiteFooter />
        </div>
      )}
    </Router>
  );
}
