import { Component } from "solid-js";
import { useRoutes } from "@solidjs/router";

import PrimaryNav from "./components/primary-nav/PrimaryNav";
import { appRoutes } from "./routes";
import { useAppSettings } from './settings/_context';

const App: Component = () => {
    const Routes = useRoutes(appRoutes);
    const [appSettings] = useAppSettings();

    return (
        <div classList={{ [appSettings.theme]: true }}
             class="bg-bg text-text grid
                  grid-rows-[max-content_auto] grid-cols-[100vw]
                  md:grid-rows-[100vh] md:grid-cols-[max-content_auto]">
            <PrimaryNav />
            <Routes />
        </div>
    );
};

export default App;
