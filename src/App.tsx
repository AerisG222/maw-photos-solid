import { Component, Show } from "solid-js";
import { useRoutes } from "@solidjs/router";

import { appRoutes } from "./routes";
import { useAppSettingsContext } from './contexts/settings/AppSettingsContext';
import { useFullscreenContext } from './contexts/FullscreenContext';

import PrimaryNav from "./components/primary-nav/PrimaryNav";
import CategoryLoader from './CategoryLoader';

const App: Component = () => {
    const Routes = useRoutes(appRoutes);
    const [appSettings] = useAppSettingsContext();
    const [fullscreen] = useFullscreenContext();

    return (
        <CategoryLoader>
            <div data-theme={appSettings.theme}
                class="grid
                    grid-rows-[max-content_auto] grid-cols-[100vw]
                    md:grid-rows-[100vh] md:grid-cols-[max-content_auto]">

                <Show when={!fullscreen.isFullscreen} fallback={<div class="w-0" />}>
                    <PrimaryNav />
                </Show>

                <Routes />
            </div>
        </CategoryLoader>
    );
};

export default App;
