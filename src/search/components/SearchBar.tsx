import { Component, For, Show } from "solid-js";

import { useSearchContext } from "../contexts/SearchContext";

import SearchField from "../../_components/input/SearchField";
import PageHeader from "../../_components/layout/PageHeader";

const SearchBar: Component = () => {
    const [
        searchContext,
        { setSearchTerm, setActiveTerm, recentSearches, removeRecentSearch, clearRecentSearches }
    ] = useSearchContext();

    const executeSearch = () => {
        setActiveTerm(searchContext.term);
    };

    const searchFor = (term: string) => {
        setSearchTerm(term);
        setActiveTerm(term);
    };

    return (
        <>
            {/* to change the term from however far down the results have gone */}
            <PageHeader
                title="Search"
                actions={
                    <SearchField
                        placeholder="Search Categories"
                        value={searchContext.term}
                        canClear={!!searchContext.term || !!searchContext.activeTerm}
                        onInput={setSearchTerm}
                        onClear={() => {
                            setSearchTerm("");
                            setActiveTerm("");
                        }}
                        onSubmit={executeSearch}
                    />
                }
            />

            {/* only before a search: once results are showing, they are the answer */}
            <Show when={!searchContext.activeTerm && recentSearches().length > 0}>
                <section class="mt-6 flex flex-col items-center gap-2" aria-label="Recent searches">
                    <h2 class="flex items-center gap-1.5 text-title font-bold text-secondary">
                        <span class="icon-md icon-[ic--round-history]" aria-hidden="true" />
                        Recent searches
                    </h2>
                    <ul class="flex max-w-[600px] flex-wrap justify-center gap-2">
                        <For each={recentSearches()}>
                            {term => (
                                <li class="join">
                                    <button
                                        class="btn join-item btn-sm btn-outline btn-secondary"
                                        onClick={() => searchFor(term)}
                                    >
                                        {term}
                                    </button>
                                    {/* its own button rather than a key: a phone has no
                                        Delete, and one stray tap should not lose the lot */}
                                    <button
                                        class="btn join-item btn-sm btn-outline btn-secondary px-1.5"
                                        aria-label={`Remove ${term} from recent searches`}
                                        title="Remove"
                                        onClick={() => removeRecentSearch(term)}
                                    >
                                        <span class="icon-sm icon-[ic--round-close]" />
                                    </button>
                                </li>
                            )}
                        </For>
                    </ul>
                    <button
                        class="btn btn-xs btn-ghost text-muted hover:text-error"
                        onClick={clearRecentSearches}
                    >
                        Clear history
                    </button>
                </section>
            </Show>
        </>
    );
};

export default SearchBar;
