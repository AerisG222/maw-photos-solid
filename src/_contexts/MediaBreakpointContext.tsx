import { createContext, ParentComponent, useContext } from "solid-js";
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

    /*
       Handed on as it comes, rather than copied into a store of our own.

       `createBreakpoints` already returns a reactive store, and mirroring it
       through an effect bought nothing and cost a render: an effect does not run
       until after the first one, so the copy began life at `false, false` and
       every screen looked like a phone until it caught up. That was invisible
       while the only consumers picked a CSS class, and stopped being invisible
       as soon as something *acted* on the answer - the bulk edit guard
       navigates, and bounced a desktop reader to the grid on load.

       Seeding the copy fixed the symptom. Not copying removes the question.
    */
    const matches = createBreakpoints(breakpoints);

    const gteMd = () => matches.md;
    const ltMd = () => !matches.md;
    const gteLg = () => matches.lg;

    return (
        <MediaBreakpointContext.Provider value={[matches, { gteMd, ltMd, gteLg }]}>
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
