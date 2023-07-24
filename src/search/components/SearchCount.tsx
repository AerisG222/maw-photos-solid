import { Component } from 'solid-js';

import { useSearchContext } from '../contexts/SearchContext';

const SearchCount: Component = () => {
    const [searchContext] = useSearchContext();

    return (
        <div class="flex justify-end my-3">
            {searchContext.categories.length} of {searchContext.foundCount}
        </div>
    );
};

export default SearchCount;
