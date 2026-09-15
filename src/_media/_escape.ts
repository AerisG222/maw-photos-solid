/*
   What Escape means, when three things could answer it.

   A media view can have an Inspector over it, be filling the screen, and have a
   photograph open, all at once. Escape backs out of exactly one of those, and
   which one is a question of what is on top:

     the Inspector, then fullscreen, then the photograph.

   Taking more than one layer at a time would be faster and worse. Leaving
   fullscreen is the thing most likely to be wanted, and overshooting it means
   finding the photograph again on a grid of several hundred.

   Written as a function of what is on screen rather than as a chain of `if`s
   inside a view, because the *order* is the part that will be got wrong when a
   fourth thing wants this key - and an order buried in a two-hundred line
   component is an order nobody can see.
*/
export type EscapeAction = "none" | "exitFullscreen" | "closeMedia";

export interface EscapeContext {
    // something above this has already answered - see SidePanel, which captures
    readonly handled: boolean;
    // a reader clearing a filter box is not backing out of anything
    readonly typing: boolean;
    readonly isFullscreen: boolean;
    readonly hasActiveMedia: boolean;
}

export const escapeAction = (context: EscapeContext): EscapeAction => {
    if (context.handled || context.typing) {
        return "none";
    }

    if (context.isFullscreen) {
        return "exitFullscreen";
    }

    return context.hasActiveMedia ? "closeMedia" : "none";
};
