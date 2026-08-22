import { lazy, ParentComponent, Show } from "solid-js";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
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

import { ApiError } from "../../_contexts/api/ApiError";
import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";
import { AuthProvider } from "../../_contexts/AuthContext";
import { CategoriesProvider } from "../../_contexts/api/CategoriesContext";
import { ClansProvider } from "../../_contexts/api/ClansContext";
import { ConfigProvider } from "../../_contexts/api/ConfigContext";
import { FullscreenProvider } from "../../_contexts/FullscreenContext";
import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { MediaProvider } from "../../_contexts/api/MediaContext";
import { PeopleProvider } from "../../_contexts/api/PeopleContext";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";
import { WindowSizeProvider } from "../../_contexts/WindowSizeContext";

import ThemeWrapper from "../../_components/theme/ThemeWrapper";
import AccountActivatedGuard from "../auth/AccountActivatedGuard";

const AppContext: ParentComponent = props => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                /*
                   The default is three blind retries with backoff, so a 401 or
                   404 made the user wait through several pointless round trips
                   before anything could be shown. A 4xx reflects the request
                   itself and will not resolve on its own - surface it at once,
                   and keep retrying only the transient cases.
                */
                retry: (failureCount, error) =>
                    error instanceof ApiError && error.isClientError ? false : failureCount < 2
            },
            // a write should never be replayed automatically
            mutations: { retry: false }
        }
    });

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
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
                                                            <FullscreenProvider>
                                                                {props.children}
                                                            </FullscreenProvider>
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
            </QueryClientProvider>
        </AuthProvider>
    );
};

export default AppContext;
