import { ParentComponent, Show } from "solid-js";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";

import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";
import { AuthProvider } from "../../_contexts/AuthContext";
import { CategoriesProvider } from "../../_contexts/api/CategoriesContext";
import { ConfigProvider } from "../../_contexts/api/ConfigContext";
import { FullscreenProvider } from "../../_contexts/FullscreenContext";
import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { MediaProvider } from "../../_contexts/api/MediaContext";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";
import { WindowSizeProvider } from "../../_contexts/WindowSizeContext";

import ThemeWrapper from "../../_components/theme/ThemeWrapper";
import AccountActivatedGuard from "../auth/AccountActivatedGuard";

const AppContext: ParentComponent = props => {
    const queryClient = new QueryClient();

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
                                                    <FullscreenProvider>
                                                        {props.children}
                                                    </FullscreenProvider>
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
