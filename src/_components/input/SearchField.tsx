import { Component, Show } from "solid-js";

import Icon from "../icon/Icon";
import Tooltip from "../tooltip/Tooltip";

interface Props {
    value: string;
    placeholder: string;
    onInput: (value: string) => void;
    onClear: () => void;
    // whether there is anything to clear - a search still showing after its text
    // was deleted by hand still has something, so this is not always the value
    canClear: boolean;
    /*
       For a search that runs when asked: a button, and Enter. Without it the page
       is filtering what it already has, as each key is pressed, and there is
       nothing to press.
    */
    onSubmit?: () => void;
}

/*
   The box a page's header searches or filters with.

   People, Places and Search each drew their own, and had each ended up with a
   large red button to clear it: the loudest thing in the row, for the one action
   that costs nothing to undo. It sits inside the box now, and only when it would
   do something.
*/
const SearchField: Component<Props> = props => {
    let input!: HTMLInputElement;

    const clear = () => {
        props.onClear();
        // back where it was: clearing a term is usually to type another
        input.focus();
    };

    return (
        <div class="flex items-center gap-2 max-w-full">
            <label class="input input-md w-80 min-w-0 max-w-full">
                <input
                    ref={input}
                    type="text"
                    class="grow min-w-0"
                    placeholder={props.placeholder}
                    aria-label={props.placeholder}
                    value={props.value}
                    onInput={evt => props.onInput(evt.currentTarget.value)}
                    onKeyDown={evt => {
                        if (evt.key === "Enter") {
                            props.onSubmit?.();
                        }
                    }}
                />

                <Show when={props.canClear}>
                    <Tooltip
                        as="button"
                        type="button"
                        content="Clear"
                        class="btn btn-ghost btn-xs btn-circle text-muted hover:text-base-content"
                        aria-label="Clear"
                        onClick={clear}
                    >
                        <Icon classes="icon-[ic--round-close] text-base" />
                    </Tooltip>
                </Show>
            </label>

            <Show when={props.onSubmit}>
                <Tooltip
                    as="button"
                    type="button"
                    content="Search"
                    class="btn btn-primary btn-outline shrink-0"
                    aria-label="Search"
                    onClick={() => props.onSubmit?.()}
                >
                    <Icon classes="icon-md icon-[ic--round-search]" />
                </Tooltip>
            </Show>
        </div>
    );
};

export default SearchField;
