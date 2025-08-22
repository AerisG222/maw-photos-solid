import { Component, Show } from "solid-js";

import SearchMoreButton from "./SearchMoreButton";

export type SearchResultStatusProps = {
    hasMore: boolean;
    continueSearch: () => void;
};

const SearchResultStatus: Component<SearchResultStatusProps> = props => {
    return (
        <>
            <Show when={props.hasMore}>
                <SearchMoreButton continueSearch={() => props.continueSearch()} />
            </Show>
        </>
    );
};

export default SearchResultStatus;
