import { ParentComponent, createEffect, createSignal, onCleanup, onMount } from "solid-js";

import { isEditableTarget } from "../shortcuts/_util";

interface Props {
    /*
       The listing becomes one tab stop, and the arrows move within it.

       Off by default, and deliberately off in the media grids: the arrows there
       already step through photographs, and two things answering one key is the
       fault this rework spent three steps removing.
    */
    keyboardCursor?: boolean;
    // the entrance animation, which a skeleton or a nested picker does not want
    animate?: boolean;
    class?: string;
}

/*
   The box a listing's items sit in.

   Twelve places wrote out `flex gap-2 flex-wrap place-content-center` for
   themselves, which is the sort of duplication that is harmless right up until
   somebody wants to change how a listing behaves - and then has to find all
   twelve.

   What it adds beyond the class string is a way through it. Categories, people
   and places could not be moved through from the keyboard: every tile was its
   own tab stop, so reaching the fortieth meant forty presses and there was no
   way at all to move down a row.

   A roving tabindex fixes both halves of that. Tab reaches the listing once and
   lands on wherever the reader was; the arrows move between items; Tab again
   leaves for whatever follows. Which is also why the arrows alone would not have
   been enough - without the roving part, getting *to* the tiles still cost a
   press each.
*/
const ListingSurface: ParentComponent<Props> = props => {
    let container!: HTMLDivElement;

    // which item Tab will land on. Arrow keys move it; focusing one directly -
    // by clicking, or by shift-tabbing in from below - adopts it
    const [cursor, setCursor] = createSignal(0);

    // the tiles themselves, rather than every focusable thing inside them: a
    // tile holds its own favourite button, which is not a step along the row
    const items = () =>
        [...container.children].filter(
            (el): el is HTMLElement => el instanceof HTMLElement && !el.hasAttribute("aria-hidden")
        );

    const focusable = (item: HTMLElement) =>
        item.matches("a[href], button") ? item : item.querySelector<HTMLElement>("a[href], button");

    /*
       One tab stop for the whole listing. Everything except the cursor is taken
       out of the tab order; all of it stays reachable with the arrows, and a
       screen reader still sees a list of links either way.
    */
    const applyTabStops = () => {
        if (!props.keyboardCursor) {
            return;
        }

        const all = items();

        all.forEach((item, index) => {
            const el = focusable(item);

            if (el) {
                // clamped: the listing can shrink under a filter while the
                // cursor is still pointing past the end of it
                el.tabIndex = index === Math.min(cursor(), all.length - 1) ? 0 : -1;
            }
        });
    };

    onMount(() => {
        applyTabStops();

        /*
           The tiles arrive after the listing does - a query resolves, a filter
           narrows it, paging appends more - so the tab stops have to be reapplied
           as the children change rather than once on mount.
        */
        const observer = new MutationObserver(applyTabStops);

        observer.observe(container, { childList: true });
        onCleanup(() => observer.disconnect());
    });

    createEffect(applyTabStops);

    /*
       How many fit across, measured rather than assumed: the tiles wrap, their
       size follows the density, and a listing can be any width. Items sharing a
       top edge are on the same row.
    */
    const perRow = (all: HTMLElement[]) => {
        const top = all[0]?.offsetTop;

        return Math.max(1, all.filter(el => el.offsetTop === top).length);
    };

    const onFocusIn = (evt: FocusEvent) => {
        if (!props.keyboardCursor) {
            return;
        }

        const index = items().findIndex(el => el.contains(evt.target as Node));

        if (index >= 0) {
            setCursor(index);
        }
    };

    const onKeyDown = (evt: KeyboardEvent) => {
        if (!props.keyboardCursor || isEditableTarget(evt.target)) {
            return;
        }

        const all = items();
        const current = all.findIndex(el => el.contains(evt.target as Node));

        if (current < 0) {
            return;
        }

        const step = perRow(all);
        const next = {
            ArrowRight: current + 1,
            ArrowLeft: current - 1,
            ArrowDown: current + step,
            ArrowUp: current - step,
            Home: 0,
            End: all.length - 1
        }[evt.key];

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

    return (
        <div
            ref={container}
            onKeyDown={onKeyDown}
            onFocusIn={onFocusIn}
            class={`flex gap-2 flex-wrap place-content-center ${props.class ?? ""}`}
            classList={{ "rise-in": !!props.animate }}
        >
            {props.children}
        </div>
    );
};

export default ListingSurface;
