import { createWindowSize } from "@solid-primitives/resize-observer";
import { createContext, createEffect, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export type WindowSizeState = {
    readonly width: number;
    readonly height: number;
};

export const defaultWindowSizeState: WindowSizeState = {
    width: 1000,
    height: 1000
};

export type WindowSizeContextValue = [state: WindowSizeState, actions: {}];

const WindowSizeContext = createContext<WindowSizeContextValue>();

export const WindowSizeProvider: ParentComponent = props => {
    const [state, setState] = createStore(defaultWindowSizeState);
    const size = createWindowSize();

    createEffect(() => {
        setState({
            width: size.width,
            height: size.height
        });
    });

    return (
        <WindowSizeContext.Provider value={[state, {}]}>
            {props.children}
        </WindowSizeContext.Provider>
    );
};

export const useWindowSizeContext = () => {
    const ctx = useContext(WindowSizeContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("Shortcut context not provided by ancestor component!");
};
