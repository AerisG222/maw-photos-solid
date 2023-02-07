import type { Component } from "solid-js";
import { useRoutes } from "@solidjs/router";

import PrimaryNav from "./components/PrimaryNav";
import { appRoutes } from "./routes";

const App: Component = () => {
    const Routes = useRoutes(appRoutes);

    return (
        <div class="grid grid-rows-[100vh] grid-cols-[max-content_auto]">
            <PrimaryNav></PrimaryNav>
            <Routes />
        </div>
    );
};

export default App;
