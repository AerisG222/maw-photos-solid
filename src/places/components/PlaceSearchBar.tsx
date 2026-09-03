import { Component, For, createEffect, createSignal } from "solid-js";

import { allPlaceKinds, PlaceKind } from "../../_models/Place";

interface Props {
    search: string;
    kind: PlaceKind | undefined;
    onSearch: (term: string) => void;
    onKind: (kind: PlaceKind | undefined) => void;
}

/*
   Finding a place anywhere in the tree, rather than drilling to it.

   This is what makes the corrections possible at all: merging a duplicate means
   finding the second one, and drilling to it requires already knowing where it
   is - which is exactly what is unknown when hunting duplicates. The API matches
   names across the whole tree and ignores the level being browsed, so "every
   city called Zhuhai" is one request.

   Submitted rather than sent per keystroke: a search is a whole-tree query, and
   the term is put in the address so a hunt survives a reload.
*/
const PlaceSearchBar: Component<Props> = props => {
    // seeded by the effect below rather than at creation, so the one path that
    // fills this box is the term in the address - on first render, on a reload,
    // and on following a link back to a search that was already running
    const [term, setTerm] = createSignal("");

    createEffect(() => setTerm(props.search));

    const submit = () => props.onSearch(term().trim());

    const clear = () => {
        setTerm("");
        props.onSearch("");
    };

    return (
        <div class="flex flex-wrap items-center justify-center gap-2 my-4">
            <input
                type="text"
                placeholder="Find a Place"
                class="input input-bordered input-md w-80"
                value={term()}
                onInput={evt => setTerm(evt.currentTarget.value)}
                onKeyDown={evt => {
                    // the page listens for single key shortcuts, which would
                    // otherwise fire for every letter typed here
                    evt.stopPropagation();

                    if (evt.key === "Enter") {
                        submit();
                    }
                }}
            />

            <button class="btn btn-primary btn-outline" title="Search" onClick={submit}>
                <span class="text-6 icon-[ic--round-search]" />
            </button>

            <button
                class="btn btn-error btn-outline hover:bg-error hover:text-error-content"
                title="Clear"
                onClick={clear}
            >
                <span class="text-6 icon-[ic--round-close]" />
            </button>

            <select
                class="select select-bordered"
                value={props.kind ?? ""}
                onChange={evt =>
                    props.onKind((evt.currentTarget.value || undefined) as PlaceKind | undefined)
                }
            >
                <option value="">All Kinds</option>
                <For each={allPlaceKinds}>
                    {kind => <option value={kind.id}>{kind.name}</option>}
                </For>
            </select>
        </div>
    );
};

export default PlaceSearchBar;
