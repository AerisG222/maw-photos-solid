import { ParentComponent } from "solid-js";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";
import { AuthProvider } from "../../_contexts/AuthContext";
import { CategoryProvider } from "../../_contexts/CategoryContext";
import { ConfigProvider } from "../../_contexts/api/ConfigContext";
import { FullscreenProvider } from "../../_contexts/FullscreenContext";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";
import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { RouteDetailProvider } from "../../_contexts/RouteDetailContext";
import { WindowSizeProvider } from "../../_contexts/WindowSizeContext";

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
                                        <CategoryProvider>
                                            <FullscreenProvider>
                                                <RouteDetailProvider>
                                                    {props.children}
                                                </RouteDetailProvider>
                                            </FullscreenProvider>
                                        </CategoryProvider>
                                    </ConfigProvider>
                                </ThemeWrapper>
                            </AllSettingsProvider>
                        </ShortcutProvider>
                    </MediaBreakpointProvider>
                </WindowSizeProvider>
            </QueryClientProvider>
        </AuthProvider>
    );
};

export default AppContext;
