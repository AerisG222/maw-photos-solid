import { ParentComponent } from "solid-js";

import { createRovingFocus } from "../a11y/rovingFocus";

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
   way at all to move down a row. `createRovingFocus` is that, and it is shared
   with the toolbar now, which had the same fifteen-tab-stops problem.
*/
const ListingSurface: ParentComponent<Props> = props => {
    let container!: HTMLDivElement;

    const { onKeyDown, onFocusIn } = createRovingFocus(() => container, {
        enabled: () => !!props.keyboardCursor,
        // the tiles wrap, so up and down cross a row rather than stepping one
        axis: () => "grid"
    });

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
