import "@unocss/reset/tailwind.css"
import "uno.css";

import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import { appRoutes } from './routes';

import AppContext from './components/app-context/AppContext';
import App from './App';

render(() =>
    <Router root={props =>
        <AppContext>
            <App {...props} />
        </AppContext>
    }>
        { appRoutes }
    </Router>,
    document.getElementById("root")
);
