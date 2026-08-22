import { Component } from "solid-js";

interface Props {
    filter: string;
    setFilter: (filter: string) => void;
}

/*
   Filtering happens here in the browser rather than at the API: the whole list
   arrives in one request precisely so a name can be narrowed down without a
   round trip per keystroke.
*/
const PersonFilterBar: Component<Props> = props => {
    return (
        <div class="flex flex-row justify-center my-4">
            <input
                type="text"
                placeholder="Filter by Name"
                class="input input-bordered input-md w-[400px]"
                value={props.filter}
                onInput={evt => props.setFilter(evt.currentTarget.value)}
                onKeyDown={evt => evt.stopPropagation()}
            />

            <button
                class="ml-3 btn btn-error btn-outline hover:bg-error hover:text-error-content"
                title="Clear"
                onClick={() => props.setFilter("")}
            >
                <span class="text-6 icon-[ic--round-close]" />
            </button>
        </div>
    );
};

export default PersonFilterBar;
