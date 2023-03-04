import { Component, createEffect } from "solid-js";
import { useLocation, useNavigate, useRoutes } from "@solidjs/router";

import PrimaryNav from "./components/primary-nav/PrimaryNav";
import { appRoutes } from "./routes";

const App: Component = () => {
    const Routes = useRoutes(appRoutes);
    const location = useLocation();
    const navigate = useNavigate();

    createEffect(() => {
        if(location.pathname === "/") {
            navigate("/categories", { replace: true });
        }
    });

    return (
        <div class="grid
                    grid-rows-[max-content_auto] grid-cols-[100vw]
                    md:grid-rows-[100vh] md:grid-cols-[max-content_auto]">
            <PrimaryNav />
            <Routes />
        </div>
    );
};

export default App;
