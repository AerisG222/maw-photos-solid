import { Component, Show } from "solid-js";

import SearchMoreButton from "./SearchMoreButton";

type Props = {
    hasMore: boolean;
    continueSearch: () => void;
};

const SearchResultStatus: Component<Props> = props => {
    return (
        <>
            <Show when={props.hasMore}>
                <SearchMoreButton continueSearch={() => props.continueSearch()} />
            </Show>
        </>
    );
};

export default SearchResultStatus;
