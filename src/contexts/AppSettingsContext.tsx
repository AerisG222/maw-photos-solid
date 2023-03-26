import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { KEY_SETTINGS_APP, loadJson, saveJson } from '../models/settings/storage';
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
    const [state, setState] = createStore(loadAppSettings());

    const setTheme = (theme: string) => {
        setState({theme: theme});
        saveAppSettings(state);
    };

    return (
        <AppSettingsContext.Provider value={[state, { setTheme }]}>
            {props.children}
        </AppSettingsContext.Provider>
    );
}

export const useAppSettings = () => useContext(AppSettingsContext);

function loadAppSettings() {
    return loadJson(KEY_SETTINGS_APP, defaultAppSettings);
}

function saveAppSettings(state: AppSettingsState) {
    saveJson(KEY_SETTINGS_APP, state);
}
