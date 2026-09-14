import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

import { isEditableTarget } from "../shortcuts/_util";

/*
   How the arrows move within a group.

   `grid` is a listing that wraps, so up and down cross a row and the row width
   has to be measured. `horizontal` and `vertical` are a single line - a toolbar
   - where the cross-axis arrows mean nothing and should be left for whatever
   else wants them.
*/
export type RovingAxis = "grid" | "horizontal" | "vertical";

interface Options {
    // off by default in the media grids, where the arrows already step through
    // photographs and two things answering one key is a fault, not a feature
    enabled: () => boolean;
    axis: () => RovingAxis;
    /*
       Claim the key on the way down rather than on the way back up.

       For a group holding a control with its own idea about the arrows - a menu
       button opens on ArrowDown by convention - listening on the bubble means
       that control sees the key first, so arrowing onto it triggers it instead
       of moving past it. Capturing stops the key ever reaching it, which is the
       right reading of the toolbar pattern: inside a toolbar the arrows belong
       to the toolbar, and Enter or Space still activates.
    */
    capture?: boolean;
}

/*
   One tab stop for a group of controls, with the arrows moving inside it.

   Tab reaches the group once and lands on wherever the reader was; the arrows
   move between items; Tab again leaves for whatever follows. Both halves matter
   - arrows alone would still leave every item its own tab stop, so *reaching*
   the fifteenth cost fifteen presses, and a roving stop alone would leave no way
   to move between them.

   This was written for `ListingSurface`, where the fortieth tile was forty
   presses away. A toolbar has the same shape and the same problem.
*/
export const createRovingFocus = (container: () => HTMLElement, options: Options) => {
    // which item Tab will land on. Arrow keys move it; focusing one directly -
    // by clicking, or by shift-tabbing in from below - adopts it
    const [cursor, setCursor] = createSignal(0);

    const focusable = (item: HTMLElement) =>
        item.matches("a[href], button") ? item : item.querySelector<HTMLElement>("a[href], button");

    /*
       The items themselves, rather than every focusable thing inside them: a
       tile holds its own favourite button, which is not a step along the row.

       Only those that can actually take focus. A toolbar is not a clean row of
       buttons - it has dividers between its groups and a spacer pushing the
       last one to the end - and counting those as steps would mean an arrow
       press that lands on a separator and appears to do nothing.
    */
    const items = () =>
        [...container().children].filter(
            (el): el is HTMLElement =>
                el instanceof HTMLElement && !el.hasAttribute("aria-hidden") && !!focusable(el)
        );

    /*
       Everything except the cursor is taken out of the tab order; all of it
       stays reachable with the arrows, and a screen reader still sees the whole
       group either way.
    */
    const applyTabStops = () => {
        if (!options.enabled()) {
            return;
        }

        const all = items();

        all.forEach((item, index) => {
            const el = focusable(item);

            if (el) {
                // clamped: the group can shrink under a filter while the cursor
                // is still pointing past the end of it
                el.tabIndex = index === Math.min(cursor(), all.length - 1) ? 0 : -1;
            }
        });
    };

    const onFocusIn = (evt: FocusEvent) => {
        if (!options.enabled()) {
            return;
        }

        const index = items().findIndex(el => el.contains(evt.target as Node));

        if (index >= 0) {
            setCursor(index);
        }
    };

    const onKeyDown = (evt: KeyboardEvent) => {
        if (!options.enabled() || isEditableTarget(evt.target)) {
            return;
        }

        const all = items();
        const current = all.findIndex(el => el.contains(evt.target as Node));

        if (current < 0) {
            return;
        }

        const axis = options.axis();
        const step = axis === "grid" ? perRow(all) : 1;

        const moves: Record<string, number | undefined> = {
            Home: 0,
            End: all.length - 1
        };

        if (axis !== "vertical") {
            moves.ArrowRight = current + (axis === "grid" ? 1 : 1);
            moves.ArrowLeft = current - 1;
        }

        if (axis !== "horizontal") {
            moves.ArrowDown = current + step;
            moves.ArrowUp = current - step;
        }

        const next = moves[evt.key];

        if (next === undefined) {
            return;
        }

        const target = all[Math.min(all.length - 1, Math.max(0, next))];
        const el = target && focusable(target);

        if (el) {
            /*
               Stopped as well as prevented: the arrows are registered globally
               as shortcuts too, and without this a press would move the cursor
               *and* whatever else claims that key.
            */
            evt.preventDefault();
            evt.stopPropagation();
            el.focus();
        }
    };

    onMount(() => {
        applyTabStops();

        /*
           Attached here rather than bound in JSX, because the capture phase is
           not something Solid's `on*` props can ask for.
        */
        const el = container();

        el.addEventListener("keydown", onKeyDown, { capture: !!options.capture });
        el.addEventListener("focusin", onFocusIn);

        onCleanup(() => {
            el.removeEventListener("keydown", onKeyDown, { capture: !!options.capture });
            el.removeEventListener("focusin", onFocusIn);
        });

        /*
           The items arrive after the group does - a query resolves, a filter
           narrows it, paging appends more - so the tab stops have to be
           reapplied as the children change rather than once on mount.
        */
        const observer = new MutationObserver(applyTabStops);

        observer.observe(container(), { childList: true });
        onCleanup(() => observer.disconnect());
    });

    createEffect(applyTabStops);

    /*
       How many fit across, measured rather than assumed: the items wrap, their
       size follows the density, and a listing can be any width. Items sharing a
       top edge are on the same row.
    */
    const perRow = (all: HTMLElement[]) => {
        const top = all[0]?.offsetTop;

        return Math.max(1, all.filter(el => el.offsetTop === top).length);
    };
};
