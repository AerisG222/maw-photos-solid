import { Component } from "solid-js";

import FilterMenu from "../../_components/filters/FilterMenu";
import Checkbox from "../../_components/input/Checkbox";

interface Props {
    favoritesOnly: boolean;
    setFavoritesOnly: (favoritesOnly: boolean) => void;
}

// favorites alone for now: a feed arrives a page at a time, so filtering by type has to be the API's
const FeedFilterMenu: Component<Props> = props => (
    <FilterMenu
        activeCount={props.favoritesOnly ? 1 : 0}
        onClear={() => props.setFavoritesOnly(false)}
        toggleFavorites={() => props.setFavoritesOnly(!props.favoritesOnly)}
    >
        <Checkbox
            title="Favorites"
            name="filter-favorites"
            isSelected={props.favoritesOnly}
            onChange={props.setFavoritesOnly}
        />
    </FilterMenu>
);

export default FeedFilterMenu;
