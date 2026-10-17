/*
   Move between views by morphing rather than cutting.

   Going from a photograph in the grid to the same photograph in fullscreen is
   the same photograph; the application knew that and the screen did not, because
   one view was torn down and another built in its place. The browser can tween
   the two if it is told they are the same thing, which is what the
   `view-transition-name` on the main photograph says.

   Everything else cross-fades, which is what a View Transition does by default
   and is the reason this costs one hook rather than an animation per screen.
*/
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const supported = () =>
    typeof document !== "undefined" && typeof document.startViewTransition === "function";

const wantsMotion = () =>
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function" ||
    !window.matchMedia(REDUCED_MOTION).matches;

// whether a navigation should be animated: the browser can, and the reader has not asked otherwise
export const shouldAnimate = () => supported() && wantsMotion();

/*
   A transition that was superseded is not a failure.

   `startViewTransition` hands back promises, and `ready` rejects with an
   `AbortError` the moment a second transition starts before the first has
   finished - which is what navigating twice in quick succession *is*. Nothing
   was attached to them, so the browser reported every one as an unhandled
   rejection: `AbortError: Transition was skipped. New ViewTransition started`.

   Swallowing only the supersession, and only by name. Anything else going wrong
   here means the navigation itself failed, which is worth seeing rather than
   hiding - the whole point of attaching a handler is to be specific about which
   rejection is expected.
*/
const SUPERSEDED = "AbortError";

export const settleTransition = (transition: ViewTransition) => {
    const report = (error: unknown) => {
        if ((error as Error | undefined)?.name !== SUPERSEDED) {
            console.error("View transition failed:", error);
        }
    };

    void transition.ready.catch(report);
    void transition.updateCallbackDone.catch(report);
    void transition.finished.catch(report);
};

/*
   The router's own `startViewTransition`, replaced - see _router/router.tsx.

   TanStack Router can wrap navigations in a View Transition itself, and does
   most of what this did. It leaves out the two things that took the longest to
   get right here: it animates whatever the reader's motion preference, and it
   attaches nothing to `ready` or `finished`, so every superseded transition is
   back in the console as an unhandled AbortError.
*/
export const startRouteTransition = (update: () => Promise<void>) => {
    if (!shouldAnimate()) {
        return update();
    }

    const transition = document.startViewTransition(update);

    settleTransition(transition);

    return transition.updateCallbackDone;
};
