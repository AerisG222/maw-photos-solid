import { ParentComponent } from "solid-js";

import { MediaListProvider } from "./contexts/MediaListContext";
import { SlideshowProvider } from "./contexts/SlideshowContext";
import { VisualEffectsProvider } from "./contexts/VisualEffectsContext";

import AuthGuard from "../_components/auth/AuthGuard";

const MediaRoot: ParentComponent = props => {
    return (
        <AuthGuard>
            <MediaListProvider>
                <SlideshowProvider>
                    <VisualEffectsProvider>{props.children}</VisualEffectsProvider>
                </SlideshowProvider>
            </MediaListProvider>
        </AuthGuard>
    );
};

export default MediaRoot;
