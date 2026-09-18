import { Component, For, Show } from "solid-js";

import { useSearchContext } from "../contexts/SearchContext";

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

    const keyDown = (evt: KeyboardEvent) => {
        if (evt.key === "Enter") {
            executeSearch();
        }
    };

    return (
        <>
            <div class="flex flex-row justify-center">
                <input
                    type="text"
                    placeholder="Search Terms"
                    class="input input-bordered input-md w-[400px]"
                    value={searchContext.term}
                    onKeyDown={keyDown}
                    onInput={evt => setSearchTerm(evt.currentTarget.value)}
                />

                <button
                    class="ml-3 btn btn-primary btn-outline hover:bg-primary hover:text-primary-content"
                    title="Search"
                    onClick={executeSearch}
                >
                    <span class="icon-md icon-[ic--round-search]" />
                </button>

                <button
                    class="ml-3 btn btn-error btn-outline hover:bg-error hover:text-error-content"
                    title="Cancel"
                    onClick={() => {
                        setSearchTerm("");
                        setActiveTerm("");
                    }}
                >
                    <span class="icon-md icon-[ic--round-close]" />
                </button>
            </div>

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
