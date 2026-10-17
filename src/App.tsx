import { ParentComponent, Show } from "solid-js";

import { useFullscreenContext } from "./_contexts/FullscreenContext";

import PrimaryNav from "./_components/primary-nav/PrimaryNav";
import ShortcutDialog from "./_components/shortcuts/ShortcutDialog";
import AppErrorBoundary from "./_components/error/AppErrorBoundary";

const App: ParentComponent = props => {
    const [fullscreen] = useFullscreenContext();

    return (
        <>
            <ShortcutDialog />
            <div
                class="grid h-dvh w-full
                    grid-rows-[max-content_minmax(0,1fr)] grid-cols-[100%]
                    md:grid-rows-[100%] md:grid-cols-[max-content_minmax(0,1fr)]"
            >
                <Show when={!fullscreen.isFullscreen} fallback={<div class="w-0" />}>
                    <PrimaryNav />
                </Show>

                {/*
                    Scoped to the routed page so a crash there leaves the nav
                    usable - the user can navigate away instead of reloading.
                */}
                <AppErrorBoundary title="This page could not be displayed">
                    {props.children}
                </AppErrorBoundary>
            </div>
        </>
    );
};

export default App;
