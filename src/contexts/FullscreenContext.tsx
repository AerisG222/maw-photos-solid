import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

export type FullscreenState = {
    readonly isFullscreen: boolean;
};

export const defaultFullscreenState: FullscreenState = {
    isFullscreen: false
};

export type FullscreenContextValue = [
    state: FullscreenState,
    actions: {
        setFullscreen: (isFullscreen: boolean) => void;
    }
];

const FullscreenContext = createContext<FullscreenContextValue>();

export const FullscreenProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultFullscreenState);
    const setFullscreen = (isFullscreen: boolean) => setState({isFullscreen: isFullscreen});

    return (
        <FullscreenContext.Provider value={[state, { setFullscreen }]}>
            {props.children}
        </FullscreenContext.Provider>
    );
};

export const useFullscreenContext = () => useContext(FullscreenContext);
