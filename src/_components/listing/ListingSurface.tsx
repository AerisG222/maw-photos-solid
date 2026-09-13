import { ParentComponent } from "solid-js";

import { isEditableTarget } from "../shortcuts/_util";

interface Props {
    /*
       Arrow keys move between the items.

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

   What it adds beyond the class string is a cursor. Categories, people and
   places could not be moved through from the keyboard at all: every tile was a
   tab stop, so reaching the fortieth meant forty presses, and there was no way
   to move down a row. The tiles are still tab stops - this is arrow-key movement
   on top of that, not instead of it.
*/
const ListingSurface: ParentComponent<Props> = props => {
    let container!: HTMLDivElement;

    // the tiles themselves, rather than every focusable thing inside them - a
    // tile holds its own favourite button, which is not a step along the row
    const items = () =>
        [...container.children].filter((el): el is HTMLElement => {
            return el instanceof HTMLElement && !el.hasAttribute("aria-hidden");
        });

    const focusable = (item: HTMLElement) =>
        item.matches("a[href], button") ? item : item.querySelector<HTMLElement>("a[href], button");

    /*
       How many fit across, measured rather than assumed: the tiles wrap, their
       size follows the density, and a listing can be any width. Items sharing a
       top edge are on the same row.
    */
    const perRow = (all: HTMLElement[]) => {
        const top = all[0]?.offsetTop;
        const count = all.filter(el => el.offsetTop === top).length;

        return Math.max(1, count);
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
            class={`flex gap-2 flex-wrap place-content-center ${props.class ?? ""}`}
            classList={{ "rise-in": !!props.animate }}
        >
            {props.children}
        </div>
    );
};

export default ListingSurface;
