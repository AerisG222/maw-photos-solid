import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

export type LayoutOptionsState = {
    readonly xPad: boolean;
};

export const defaultLayoutOptions: LayoutOptionsState = {
    xPad: true
};

export type LayoutOptionsContextValue = [
    state: LayoutOptionsState,
    actions: {
        showXpad: () => void;
        hideXpad: () => void;
    }
];

const LayoutOptionsContext = createContext<LayoutOptionsContextValue>([
    defaultLayoutOptions,
    {
        showXpad: () => undefined,
        hideXpad: () => undefined
    }
]);

export const LayoutOptionsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultLayoutOptions);
    const showXpad = () => setState({xPad: true});
    const hideXpad = () => setState({xPad: false});

    return (
        <LayoutOptionsContext.Provider value={[state, { showXpad, hideXpad }]}>
            {props.children}
        </LayoutOptionsContext.Provider>
    );
}

export const useLayoutOptionsContext = () => useContext(LayoutOptionsContext);
