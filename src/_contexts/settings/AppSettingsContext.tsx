import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { KEY_SETTINGS_APP, loadJson, saveJson } from "./_storage";

export type AppSettingsState = {
    readonly theme: string;
};

export const defaultAppSettings: AppSettingsState = {
    theme: "dark"
};

export type AppSettingsContextValue = [
    state: AppSettingsState,
    actions: {
        toggleTheme: () => void;
    }
];

const AppSettingsContext = createContext<AppSettingsContextValue>();

export const AppSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const toggleTheme = () => {
        const newTheme = state.theme === "dark" ? "light" : "dark";
        setState({ theme: newTheme });
        saveState(state);
    };

    return (
        <AppSettingsContext.Provider value={[state, { toggleTheme }]}>
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

function loadState() {
    var state = loadJson(KEY_SETTINGS_APP, defaultAppSettings);

    // handle legacy theme
    if (state.theme === "dusk") {
        return {
            theme: "dark"
        };
    }

    return state;
}

function saveState(state: AppSettingsState) {
    saveJson(KEY_SETTINGS_APP, state);
}
