import { ParentComponent, Show } from "solid-js";

import { useFullscreenContext } from "./_contexts/FullscreenContext";

import PrimaryNav from "./_components/primary-nav/PrimaryNav";
import ShortcutDialog from "./_components/shortcuts/ShortcutDialog";

const App: ParentComponent = props => {
    const [fullscreen] = useFullscreenContext();

    return (
        <>
            <ShortcutDialog />
            <div
                class="grid
                    grid-rows-[max-content_100vh] grid-cols-[100vw]
                    md:grid-rows-[100vh] md:grid-cols-[max-content_auto]"
            >
                <Show when={!fullscreen.isFullscreen} fallback={<div class="w-0" />}>
                    <PrimaryNav />
                </Show>

                {props.children}
            </div>
        </>
    );
};

export default App;
