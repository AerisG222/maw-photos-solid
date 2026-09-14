import { ParentComponent } from "solid-js";

interface Props {
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

   It used to carry a roving-tabindex cursor as well: one tab stop for the whole
   listing, with the arrows moving between tiles. That is gone, and the tiles are
   ordinary tab stops again. Swapping between Tab and the arrows partway down a
   page is not a convention a reader would find, and the implementation kept
   turning up faults nobody could see - three of them, each needing a keyboard to
   notice. Browser defaults first; if there is a real problem here it can be
   looked at from a clean slate.
*/
const ListingSurface: ParentComponent<Props> = props => {
    return (
        <div
            class={`flex gap-2 flex-wrap place-content-center ${props.class ?? ""}`}
            classList={{ "rise-in": !!props.animate }}
        >
            {props.children}
        </div>
    );
};

export default ListingSurface;
