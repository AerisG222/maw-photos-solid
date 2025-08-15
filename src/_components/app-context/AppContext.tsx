import { ParentComponent } from "solid-js";

import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";
import { AuthProvider } from "../../_contexts/AuthContext";
import { CategoryProvider } from "../../_contexts/CategoryContext";
import { FullscreenProvider } from "../../_contexts/FullscreenContext";
import { ShortcutProvider } from "../../_contexts/ShortcutContext";
import { MediaBreakpointProvider } from "../../_contexts/MediaBreakpointContext";
import { RouteDetailProvider } from "../../_contexts/RouteDetailContext";

import CategoryLoader from "../../_components/categories/CategoryLoader";
import ThemeWrapper from "../../_components/theme/ThemeWrapper";

const AppContext: ParentComponent = props => {
    return (
        <AuthProvider>
            <MediaBreakpointProvider>
                <ShortcutProvider>
                    <AllSettingsProvider>
                        <ThemeWrapper>
                            <CategoryProvider>
                                <CategoryLoader>
                                    <FullscreenProvider>
                                        <RouteDetailProvider>{props.children}</RouteDetailProvider>
                                    </FullscreenProvider>
                                </CategoryLoader>
                            </CategoryProvider>
                        </ThemeWrapper>
                    </AllSettingsProvider>
                </ShortcutProvider>
            </MediaBreakpointProvider>
        </AuthProvider>
    );
};

export default AppContext;
