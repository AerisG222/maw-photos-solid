import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";
import { AppSettingsState, defaultAppSettings, loadAppSettings } from '../models/Settings';

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
    };

    return (
        <AppSettingsContext.Provider value={[state, { setTheme }]}>
            {props.children}
        </AppSettingsContext.Provider>
    );
}

export const useAppSettings = () => useContext(AppSettingsContext);
