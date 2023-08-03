import { createContext, createEffect, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { createBreakpoints } from "@solid-primitives/media";

// we currently only alter display based on >= md, so only track that one for now
export type MediaBreakpointState = {
    // readonly sm: boolean;
    readonly md: boolean;
    // readonly lg: boolean;
    // readonly xl: boolean;
    // readonly xxl: boolean;
};

export const defaultMediaBreakpointState: MediaBreakpointState = {
    // sm: true,
    md: false,
    // lg: false,
    // xl: false,
    // xxl: false
};

export type MediaBreakpointContextValue = [
    state: MediaBreakpointState,
    actions: { }
];

const MediaBreakpointContext = createContext<MediaBreakpointContextValue>();

export const MediaBreakpointProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultMediaBreakpointState);

    // https://tailwindcss.com/docs/screens
    const breakpoints = {
        // sm: "640px",
        md: "768px",
        // lg: "1024px",
        // xl: "1280px",
        // xxl: "1536px"
    };

    const matches = createBreakpoints(breakpoints);

    createEffect(() => {
        setState({
            // sm: matches.sm,
            md: matches.md,
            // lg: matches.lg,
            // xl: matches.xl,
            // xxl: matches.xxl
        });
    });

    return (
        <MediaBreakpointContext.Provider value={[state, { }]}>
            {props.children}
        </MediaBreakpointContext.Provider>
    );
};

export const useMediaBreakpointContext = () => useContext(MediaBreakpointContext);
