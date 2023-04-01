import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { KEY_SETTINGS_APP, loadJson, saveJson } from './_storage';
import { AppSettingsState, defaultAppSettings } from '../models/settings';

export type AppSettingsContextValue = [
    state: AppSettingsState,
    actions: {
        setTheme: (theme: string) => void;
    }
];

const AppSettingsContext = createContext<AppSettingsContextValue>([
    defaultAppSettings,
    {
        setTheme: () => undefined
    }
]);

export const AppSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setTheme = (theme: string) => {
        setState({theme: theme});
        saveState(state);
    };

    return (
        <AppSettingsContext.Provider value={[state, { setTheme }]}>
            {props.children}
        </AppSettingsContext.Provider>
    );
}

export const useAppSettings = () => useContext(AppSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_APP, defaultAppSettings);
}

function saveState(state: AppSettingsState) {
    saveJson(KEY_SETTINGS_APP, state);
}