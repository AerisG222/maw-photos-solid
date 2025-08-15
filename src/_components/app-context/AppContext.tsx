import { ParentComponent } from "solid-js";

import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";
import { AuthProvider } from "../../_contexts/AuthContext";
import { CategoryProvider } from "../../_contexts/CategoryContext";
import { ConfigProvider } from "../../_contexts/ConfigContext";
import { FullscreenProvider } from "../../_contexts/FullscreenContext";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";
import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { RouteDetailProvider } from "../../_contexts/RouteDetailContext";
import { WindowSizeProvider } from "../../_contexts/WindowSizeContext";

import CategoryLoader from "../../_components/categories/CategoryLoader";
import ThemeWrapper from "../../_components/theme/ThemeWrapper";

const AppContext: ParentComponent = props => {
    return (
        <AuthProvider>
            <WindowSizeProvider>
                <MediaBreakpointProvider>
                    <ShortcutProvider>
                        <AllSettingsProvider>
                            <ThemeWrapper>
                                <ConfigProvider>
                                    <CategoryProvider>
                                        <CategoryLoader>
                                            <FullscreenProvider>
                                                <RouteDetailProvider>
                                                    {props.children}
                                                </RouteDetailProvider>
                                            </FullscreenProvider>
                                        </CategoryLoader>
                                    </CategoryProvider>
                                </ConfigProvider>
                            </ThemeWrapper>
                        </AllSettingsProvider>
                    </ShortcutProvider>
                </MediaBreakpointProvider>
            </WindowSizeProvider>
        </AuthProvider>
    );
};

export default AppContext;
