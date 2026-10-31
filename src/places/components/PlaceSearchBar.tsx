import { Component, createEffect, createSignal } from "solid-js";

import SearchField from "../../_components/input/SearchField";

interface Props {
    search: string;
    onSearch: (term: string) => void;
}

/*
   Finding a place anywhere in the tree, rather than drilling to it.

   This is what makes the corrections possible at all: merging a duplicate means
   finding the second one, and drilling to it requires already knowing where it
   is - which is exactly what is unknown when hunting duplicates. The API matches
   names across the whole tree and ignores the level being browsed, so "every
   place called Zhuhai" is one request.

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
        <SearchField
            placeholder="Find a Place"
            value={term()}
            canClear={!!term() || !!props.search}
            onInput={setTerm}
            onClear={clear}
            onSubmit={submit}
        />
    );
};

export default PlaceSearchBar;
