import { lazy, ParentComponent, Show } from "solid-js";
/*
   Loaded behind a statically-false branch in production so the devtools never
   reach the build output at all. A plain top-level import still emitted its
   ~220kB chunk into dist/ - unreferenced and never fetched, but shipped in the
   container all the same. `import.meta.env.DEV` is substituted at build time,
   so the dynamic import below is dead code that rollup drops.
*/
const SolidQueryDevtools = import.meta.env.DEV
    ? lazy(async () => {
          const devtools = await import("@tanstack/solid-query-devtools");

          return { default: devtools.SolidQueryDevtools };
      })
    : () => null;

import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";
import { CategoriesProvider } from "../../_contexts/api/CategoriesContext";
import { ClansProvider } from "../../_contexts/api/ClansContext";
import { ConfigProvider } from "../../_contexts/api/ConfigContext";
import { FullscreenProvider } from "../../_contexts/FullscreenContext";
import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { MediaProvider } from "../../_contexts/api/MediaContext";
import { PeopleProvider } from "../../_contexts/api/PeopleContext";
import { PlacesProvider } from "../../_contexts/api/PlacesContext";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";
import { WindowSizeProvider } from "../../_contexts/WindowSizeContext";

import ThemeWrapper from "../../_components/theme/ThemeWrapper";
import AccountActivatedGuard from "../auth/AccountActivatedGuard";

/*
   The providers beneath the router. Auth and the query client sit above it - see
   index.tsx - because the router's loaders and guards need both before any of
   these exist.
*/
const AppContext: ParentComponent = props => {
    return (
        <>
            <WindowSizeProvider>
                <MediaBreakpointProvider>
                    <ShortcutProvider>
                        <AllSettingsProvider>
                            <ThemeWrapper>
                                <ConfigProvider>
                                    <AccountActivatedGuard>
                                        <CategoriesProvider>
                                            <MediaProvider>
                                                <PeopleProvider>
                                                    <ClansProvider>
                                                        <PlacesProvider>
                                                            <FullscreenProvider>
                                                                {props.children}
                                                            </FullscreenProvider>
                                                        </PlacesProvider>
                                                    </ClansProvider>
                                                </PeopleProvider>
                                            </MediaProvider>
                                        </CategoriesProvider>
                                    </AccountActivatedGuard>
                                </ConfigProvider>
                            </ThemeWrapper>
                        </AllSettingsProvider>
                    </ShortcutProvider>
                </MediaBreakpointProvider>
            </WindowSizeProvider>

            <Show when={import.meta.env.DEV}>
                <SolidQueryDevtools initialIsOpen={false} />
            </Show>
        </>
    );
};

export default AppContext;
