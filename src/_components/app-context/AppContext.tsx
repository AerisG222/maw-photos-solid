import { ParentComponent } from "solid-js";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";
import { AuthProvider } from "../../_contexts/AuthContext";
import { CategoriesProvider } from "../../_contexts/api/CategoriesContext";
import { ConfigProvider } from "../../_contexts/api/ConfigContext";
import { FullscreenProvider } from "../../_contexts/FullscreenContext";
import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { MediaProvider } from "../../_contexts/api/MediaContext";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";
import { WindowSizeProvider } from "../../_contexts/WindowSizeContext";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";

import ThemeWrapper from "../../_components/theme/ThemeWrapper";

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
                                        <CategoriesProvider>
                                            <MediaProvider>
                                                <FullscreenProvider>
                                                    {props.children}
                                                </FullscreenProvider>
                                            </MediaProvider>
                                        </CategoriesProvider>
                                    </ConfigProvider>
                                </ThemeWrapper>
                            </AllSettingsProvider>
                        </ShortcutProvider>
                    </MediaBreakpointProvider>
                </WindowSizeProvider>

                <SolidQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AuthProvider>
    );
};

export default AppContext;
