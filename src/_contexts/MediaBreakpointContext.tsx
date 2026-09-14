import { createContext, createEffect, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { createBreakpoints } from "@solid-primitives/media";

/*
   Two widths, because the layout makes two decisions.

   `md` is where the chrome turns: a strip along the bottom of a phone becomes a
   rail down the side. `lg` is where there is room to keep the Inspector open
   *beside* the photograph rather than over it - between the two it overlays,
   and below `md` it is a sheet.

   The other Tailwind breakpoints are deliberately not tracked. Everything else
   responsive in the application is a CSS media query, which needs no JavaScript
   to know about it; these two are here because a component has to answer them
   in markup rather than in classes.
*/
export interface MediaBreakpointState {
    readonly md: boolean;
    readonly lg: boolean;
}

export const defaultMediaBreakpointState: MediaBreakpointState = {
    md: false,
    lg: false
};

export type MediaBreakpointContextValue = [
    state: MediaBreakpointState,
    actions: {
        gteMd: () => boolean;
        ltMd: () => boolean;
        gteLg: () => boolean;
    }
];

const MediaBreakpointContext = createContext<MediaBreakpointContextValue>();

export const MediaBreakpointProvider: ParentComponent = props => {
    // https://tailwindcss.com/docs/screens
    const breakpoints = {
        md: "768px",
        lg: "1024px"
    };

    const matches = createBreakpoints(breakpoints);

    /*
       Seeded from the queries rather than from the defaults.

       It used to start at `false, false` and copy the real answer across in the
       effect below, which does not run until after the first render - so for
       one render every screen looked like a phone, on a desktop. That was a
       flicker while the only consumers were choosing a CSS class. It stops
       being a flicker the moment something *acts* on the answer: the bulk edit
       guard navigates away when the panel cannot dock, and would have bounced
       a desktop reader to the grid on load.
    */
    const [state, setState] = createStore<MediaBreakpointState>({
        md: matches.md,
        lg: matches.lg
    });

    createEffect(() => {
        setState({
            md: matches.md,
            lg: matches.lg
        });
    });

    const gteMd = () => state.md;
    const ltMd = () => !state.md;
    const gteLg = () => state.lg;

    return (
        <MediaBreakpointContext.Provider value={[state, { gteMd, ltMd, gteLg }]}>
            {props.children}
        </MediaBreakpointContext.Provider>
    );
};

export const useMediaBreakpointContext = () => {
    const ctx = useContext(MediaBreakpointContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("MediaBreakpoint context not provided by ancestor component!");
};
