import { ParentComponent } from "solid-js";

import { VisualEffectsProvider } from "./contexts/VisualEffectsContext";

import AuthGuard from "../_components/auth/AuthGuard";

const MediaRoot: ParentComponent = props => {
    return (
        <AuthGuard>
            <VisualEffectsProvider>{props.children}</VisualEffectsProvider>
        </AuthGuard>
    );
};

export default MediaRoot;
