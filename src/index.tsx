import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import { appRoutes } from "./routes";

import AppContext from "./_components/app-context/AppContext";

import "./index.css";
import App from "./App";

render(
    () => (
        <Router
            root={props => (
                <AppContext>
                    <App {...props} />
                </AppContext>
            )}
        >
            {appRoutes}
        </Router>
    ),
    document.getElementById("root")!
);
