import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import { appRoutes } from "./routes";

import AppContext from "./_components/app-context/AppContext";
import AppErrorBoundary from "./_components/error/AppErrorBoundary";

// self-hosted webfonts - no render-blocking request to fonts.googleapis.com
import "@fontsource-variable/nunito-sans";
import "@fontsource/tangerine/400.css";

import "./index.css";
import App from "./App";

render(
    () => (
        // outermost net: the page-level boundary lives inside the provider tree,
        // so it cannot catch a provider itself failing to initialize
        <AppErrorBoundary title="MaW Photos could not start">
            <Router
                root={props => (
                    <AppContext>
                        <App {...props} />
                    </AppContext>
                )}
            >
                {appRoutes}
            </Router>
        </AppErrorBoundary>
    ),
    document.getElementById("root")!
);
