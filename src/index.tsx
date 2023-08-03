import "@unocss/reset/tailwind.css"
import "uno.css";

import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import { AllSettingsProvider } from "./contexts/settings/AllSettingsProvider";
import { CategoryProvider } from "./contexts/CategoryContext";
import { FullscreenProvider } from "./contexts/FullscreenContext";
import { LayoutOptionsProvider } from "./contexts/LayoutOptionsContext";
import { RouteDetailProvider } from "./contexts/RouteDetailContext";
import { ShortcutProvider } from "./contexts/ShortcutContext";
import { MediaBreakpointProvider } from './contexts/MediaBreakpointContext';

import App from "./App";
import CategoryLoader from "./components/categories/CategoryLoader";
import ShortcutDialog from "./components/shortcuts/ShortcutDialog";
import ThemeWrapper from "./components/theme/ThemeWrapper";

render(() =>
    <MediaBreakpointProvider>
    <ShortcutProvider>
    <AllSettingsProvider>
        <ThemeWrapper>
            <CategoryProvider>
            <CategoryLoader>
            <FullscreenProvider>
            <LayoutOptionsProvider>
            <Router>
                <RouteDetailProvider>
                    <ShortcutDialog />
                    <App />
                </RouteDetailProvider>
            </Router>
            </LayoutOptionsProvider>
            </FullscreenProvider>
            </CategoryLoader>
            </CategoryProvider>
        </ThemeWrapper>
    </AllSettingsProvider>
    </ShortcutProvider>
    </MediaBreakpointProvider>
    ,
    document.getElementById("root")
);
