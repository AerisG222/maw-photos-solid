import { Component } from "solid-js";

import SearchField from "../../_components/input/SearchField";

interface Props {
    filter: string;
    setFilter: (filter: string) => void;
}

/*
   Filtering happens here in the browser rather than at the API: the whole list
   arrives in one request precisely so a name can be narrowed down without a
   round trip per keystroke.
*/
const PersonFilterBar: Component<Props> = props => (
    <SearchField
        placeholder="Filter by Name"
        value={props.filter}
        canClear={!!props.filter}
        onInput={props.setFilter}
        onClear={() => props.setFilter("")}
    />
);

export default PersonFilterBar;
