import { ParentComponent } from "solid-js";

import { AllSettingsProvider } from "../../contexts/settings/AllSettingsProvider";
import { AuthProvider } from "../../contexts/AuthContext";
import { CategoryProvider } from "../../contexts/CategoryContext";
import { FullscreenProvider } from "../../contexts/FullscreenContext";
import { ShortcutProvider } from "../../contexts/ShortcutContext";
import { MediaBreakpointProvider } from "../../contexts/MediaBreakpointContext";
import { RouteDetailProvider } from "../../contexts/RouteDetailContext";

import CategoryLoader from "../../components/categories/CategoryLoader";
import ThemeWrapper from "../../components/theme/ThemeWrapper";

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
