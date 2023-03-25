import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

export type AppSettingsState = {
    readonly theme: string;
};

export type AppSettingsContextValue = [
    state: AppSettingsState,
    actions: {
        setTheme: (theme: string) => void;
    }
];

const defaultState: AppSettingsState = {
    theme: 'dark'
};

const AppSettingsContext = createContext<AppSettingsContextValue>([
    defaultState,
    {
        setTheme: () => undefined
    }
]);

export const AppSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultState);

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
