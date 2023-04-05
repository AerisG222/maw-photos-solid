import { Component } from "solid-js";
import { useRoutes } from "@solidjs/router";

import PrimaryNav from "./components/primary-nav/PrimaryNav";
import { appRoutes } from "./routes";
import { useAppSettings } from './contexts/AppSettingsContext';

const App: Component = () => {
    const Routes = useRoutes(appRoutes);
    const [appSettings] = useAppSettings();

    return (
        <div data-theme={appSettings.theme}
             class="grid
                  grid-rows-[max-content_auto] grid-cols-[100vw]
                  md:grid-rows-[100vh] md:grid-cols-[max-content_auto]">
            <PrimaryNav />
            <Routes />
        </div>
    );
};

export default App;
