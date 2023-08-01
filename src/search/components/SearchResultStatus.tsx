import { Component, Show } from "solid-js";

import { useSearchContext } from "../contexts/SearchContext";

import SearchCount from "./SearchCount";
import SearchMoreButton from "./SearchMoreButton";

const SearchResultStatus: Component = () => {
    const [searchContext, { moreResultsAvailable }] = useSearchContext();

    return (
        <>
            <Show when={searchContext.foundCount > 0}>
                <SearchCount />
            </Show>

            <Show when={moreResultsAvailable()}>
                <SearchMoreButton />
            </Show>
        </>
    );
}

export default SearchResultStatus;
