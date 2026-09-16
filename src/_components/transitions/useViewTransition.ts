import { BeforeLeaveEventArgs, useBeforeLeave } from "@solidjs/router";

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

/*
   Whether this particular navigation should be animated.

   `defaultPrevented` means somebody else has already claimed it - a guard
   sending an unauthenticated reader to the login page, say - and wrapping that
   would be overriding a decision which is not ours to override.
*/
export const shouldAnimate = (event: Pick<BeforeLeaveEventArgs, "defaultPrevented">) =>
    !event.defaultPrevented && supported() && wantsMotion();

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

export const useViewTransition = () => {
    useBeforeLeave(event => {
        if (!shouldAnimate(event)) {
            return;
        }

        event.preventDefault();

        settleTransition(
            document.startViewTransition(() => {
                event.retry(true);
            })
        );
    });
};
