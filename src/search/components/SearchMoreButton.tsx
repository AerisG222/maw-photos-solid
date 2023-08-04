import { Component, createEffect, createResource, createSignal } from "solid-js";

import { searchCategories } from "../../_api/Search";
import { useSearchContext } from "../contexts/SearchContext";

const SearchMoreButton: Component = () => {
    const [searchSignal, setSearchSignal] = createSignal(false);
    const [searchContext, { addCategories }] = useSearchContext();

    const continueSearch = () => {
        if(searchSignal()) {
            return searchCategories(searchContext.term, searchContext.categories.length);
        }

        return {
            results: [],
            totalFound: 0,
            startIndex: 0
        };
    }

    const triggerSearch = () => {
        setSearchSignal(true);
    }

    const [searchResource] = createResource(searchSignal, continueSearch);

    createEffect(() => {
        if(searchResource.state === "ready") {
            addCategories(searchResource().results);
            setSearchSignal(false);
        }
    });

    return (
        <div class="flex justify-center my-3">
            <button class="btn btn-primary btn-outline" onClick={triggerSearch}>
                <span class="text-6 i-ic-round-keyboard-arrow-down" /> Show More
            </button>
        </div>
    )
}

export default SearchMoreButton;
