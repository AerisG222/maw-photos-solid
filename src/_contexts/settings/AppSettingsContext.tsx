import {
    Accessor,
    createContext,
    createSignal,
    onCleanup,
    ParentComponent,
    useContext
} from "solid-js";
import { createStore } from "solid-js/store";

import {
    DARK_SCHEME_QUERY,
    ResolvedThemeIdType,
    ThemeIdType,
    getNextTheme,
    prefersDark,
    resolveTheme
} from "../../_models/Theme";
import { AppSettingsState, defaultAppSettings } from "./_state";
import { loadMigrated } from "./_migrate";
import { KEY_SETTINGS_V2_APP, saveJson } from "./_storage";

export type { AppSettingsState } from "./_state";
export { defaultAppSettings } from "./_state";

export type AppSettingsContextValue = [
    state: AppSettingsState,
    actions: {
        // what `data-theme` should be right now - `system` resolved against the os
        resolvedTheme: Accessor<ResolvedThemeIdType>;
        setTheme: (theme: ThemeIdType) => void;
        toggleTheme: () => void;
        setNavExpanded: (navExpanded: boolean) => void;
        toggleNavExpanded: () => void;
        setShowToolbarLabels: (showToolbarLabels: boolean) => void;
        toggleToolbarLabels: () => void;
    }
];

const AppSettingsContext = createContext<AppSettingsContextValue>();

export const AppSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadMigrated(KEY_SETTINGS_V2_APP, defaultAppSettings));

    /*
       Tracked rather than read once: someone on `system` who changes their
       operating system's appearance should see this follow without reloading.
    */
    const [systemDark, setSystemDark] = createSignal(prefersDark());

    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
        const query = window.matchMedia(DARK_SCHEME_QUERY);
        const onChange = (evt: MediaQueryListEvent) => setSystemDark(evt.matches);

        query.addEventListener("change", onChange);
        onCleanup(() => query.removeEventListener("change", onChange));
    }

    const resolvedTheme = () => resolveTheme(state.theme, systemDark());

    const updateState = (update: Partial<AppSettingsState>) => {
        setState(update);
        saveJson(KEY_SETTINGS_V2_APP, state);
    };

    const setTheme = (theme: ThemeIdType) => updateState({ theme });
    const toggleTheme = () => updateState({ theme: getNextTheme(state.theme) });
    const setNavExpanded = (navExpanded: boolean) => updateState({ navExpanded });
    const toggleNavExpanded = () => updateState({ navExpanded: !state.navExpanded });
    const setShowToolbarLabels = (showToolbarLabels: boolean) => updateState({ showToolbarLabels });
    const toggleToolbarLabels = () => updateState({ showToolbarLabels: !state.showToolbarLabels });

    return (
        <AppSettingsContext.Provider
            value={[
                state,
                {
                    resolvedTheme,
                    setTheme,
                    toggleTheme,
                    setNavExpanded,
                    toggleNavExpanded,
                    setShowToolbarLabels,
                    toggleToolbarLabels
                }
            ]}
        >
            {props.children}
        </AppSettingsContext.Provider>
    );
};

export const useAppSettingsContext = () => {
    const ctx = useContext(AppSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("AppSettings context not provided by ancestor component!");
};
