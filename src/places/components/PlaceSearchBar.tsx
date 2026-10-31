import { Component, createEffect, createSignal } from "solid-js";

import { allPlaceKinds, PlaceKind } from "../../_models/Place";

import SearchField from "../../_components/input/SearchField";
import Select from "../../_components/input/Select";

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
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 max-w-full">
            <SearchField
                placeholder="Find a Place"
                value={term()}
                canClear={!!term() || !!props.search}
                onInput={setTerm}
                onClear={clear}
                onSubmit={submit}
            />

            <Select
                inline
                title="Kind"
                itemArray={[{ id: "", name: "All Kinds" }, ...allPlaceKinds]}
                selectedValue={props.kind ?? ""}
                onChange={value => props.onKind((value || undefined) as PlaceKind | undefined)}
            />
        </div>
    );
};

export default PlaceSearchBar;
