import { ParentComponent } from "solid-js";

import { MediaListProvider } from "./contexts/MediaListContext";
import { SlideshowProvider } from "./contexts/SlideshowContext";
import { VisualEffectsProvider } from "./contexts/VisualEffectsContext";

import AuthGuard from "../_components/auth/AuthGuard";
import MediaLoader from "./MediaLoader";
import ActiveMediaMonitor from "./ActiveMediaMonitor";
import ActiveCategoryMonitor from "./ActiveCategoryMonitor";

const MediaRoot: ParentComponent = props => {
    return (
        <AuthGuard>
            <MediaListProvider>
                <ActiveCategoryMonitor>
                    <ActiveMediaMonitor>
                        <MediaLoader>
                            <SlideshowProvider>
                                <VisualEffectsProvider>{props.children}</VisualEffectsProvider>
                            </SlideshowProvider>
                        </MediaLoader>
                    </ActiveMediaMonitor>
                </ActiveCategoryMonitor>
            </MediaListProvider>
        </AuthGuard>
    );
};

export default MediaRoot;
