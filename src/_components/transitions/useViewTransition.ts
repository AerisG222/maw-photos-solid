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

export const useViewTransition = () => {
    useBeforeLeave(event => {
        if (!shouldAnimate(event)) {
            return;
        }

        event.preventDefault();

        document.startViewTransition(() => {
            event.retry(true);
        });
    });
};
