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
                class="grid h-dvh w-full
                    grid-rows-[max-content_minmax(0,1fr)] grid-cols-[100%]
                    md:grid-rows-[100%] md:grid-cols-[max-content_minmax(0,1fr)]"
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
