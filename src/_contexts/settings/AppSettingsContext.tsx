import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { KEY_SETTINGS_APP, loadJson, saveJson } from "./_storage";

export interface AppSettingsState {
    readonly theme: string;
    readonly isPrimaryNavCollapsed: boolean;
    readonly isToolbarCollapsed: boolean;
}

export const defaultAppSettings: AppSettingsState = {
    theme: "dark",
    isPrimaryNavCollapsed: false,
    isToolbarCollapsed: false
};

export type AppSettingsContextValue = [
    state: AppSettingsState,
    actions: {
        toggleTheme: () => void;
        togglePrimaryNavCollapsed: () => void;
        toggleToolbarCollapsed: () => void;
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

    const togglePrimaryNavCollapsed = () => {
        setState({ isPrimaryNavCollapsed: !state.isPrimaryNavCollapsed });
        saveState(state);
    };

    const toggleToolbarCollapsed = () => {
        setState({ isToolbarCollapsed: !state.isToolbarCollapsed });
        saveState(state);
    };

    return (
        <AppSettingsContext.Provider
            value={[state, { toggleTheme, togglePrimaryNavCollapsed, toggleToolbarCollapsed }]}
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

function loadState() {
    let state = loadJson(KEY_SETTINGS_APP, defaultAppSettings);

    // handle legacy theme
    if (state.theme === "dusk") {
        state = { ...state, theme: "dark" };
    }

    return state;
}

function saveState(state: AppSettingsState) {
    saveJson(KEY_SETTINGS_APP, state);
}
