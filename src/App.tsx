import { Component, Show } from "solid-js";
import { useRoutes } from "@solidjs/router";

import { appRoutes } from "./routes";
import { useFullscreenContext } from "./contexts/FullscreenContext";

import PrimaryNav from "./components/primary-nav/PrimaryNav";

const App: Component = () => {
    const Routes = useRoutes(appRoutes);
    const [fullscreen] = useFullscreenContext();

    return (
        <div
            class="grid
                grid-rows-[max-content_100vh] grid-cols-[100vw]
                md:grid-rows-[100vh] md:grid-cols-[max-content_auto]">

            <Show when={!fullscreen.isFullscreen} fallback={<div class="w-0" />}>
                <PrimaryNav />
            </Show>

            <Routes />
        </div>
    );
};

export default App;
