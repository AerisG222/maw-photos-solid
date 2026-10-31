import { Component } from "solid-js";

import { MediaFilters, MediaTypeFilter, countMediaFilters } from "../../_models/MediaFilters";

import FilterMenu from "../../_components/filters/FilterMenu";
import MediaFilterOptions from "../../_components/filters/MediaFilterOptions";

interface Props {
    favoritesOnly: boolean;
    mediaType: MediaTypeFilter | undefined;
    setFavoritesOnly: (favoritesOnly: boolean) => void;
    setMediaType: (mediaType: MediaTypeFilter | undefined) => void;
    clearFilters: () => void;
}

// a feed arrives a page at a time, so unlike a category these are the API's to apply
const FeedFilterMenu: Component<Props> = props => {
    const filters = (): MediaFilters => ({
        ...(props.favoritesOnly ? { f: true } : {}),
        ...(props.mediaType ? { t: props.mediaType } : {})
    });

    const onChange = (changes: MediaFilters) => {
        if ("f" in changes) {
            props.setFavoritesOnly(!!changes.f);
        }

        if ("t" in changes) {
            props.setMediaType(changes.t);
        }
    };

    return (
        <FilterMenu
            activeCount={countMediaFilters(filters())}
            onClear={() => props.clearFilters()}
            toggleFavorites={() => props.setFavoritesOnly(!props.favoritesOnly)}
        >
            <MediaFilterOptions filters={filters()} onChange={onChange} />
        </FilterMenu>
    );
};

export default FeedFilterMenu;
