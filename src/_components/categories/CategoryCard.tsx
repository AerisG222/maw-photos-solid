import { Component, For, Show } from "solid-js";

import { Category } from "../../_models/Category";
import { getCategoryPath } from "../../categories/_routes";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";
import { useListingSettingsContext } from "../../_contexts/settings/ListingSettingsContext";

import FavoriteBadge from "../listing/FavoriteBadge";
import MediaTypeIcon from "../icon/MediaTypeIcon";
import Tile from "../listing/Tile";

interface Props {
    category: Category;
    eager: boolean;
    setIsFavorite: (category: Category, isFavorite: boolean) => void;
}

/*
   One category in a listing: its teaser, its year above and its name below.

   What it no longer takes is how big to draw itself or what to show - six
   screens were each reading that from their own store and passing it down, and
   now there is one store and the tile reads it.
*/
const CategoryCard: Component<Props> = props => {
    const [listing] = useListingSettingsContext();

    const onClickFavorite = () => props.setIsFavorite(props.category, !props.category.isFavorite);

    return (
        <Tile
            href={getCategoryPath(props.category.year, props.category.slug)}
            src={getMediaTeaserUrl(props.category.teaser)}
            surface
            eager={props.eager}
            header={
                <Show when={listing.showLabels}>
                    <div class="text-center">{props.category.effectiveDate.getFullYear()}</div>
                </Show>
            }
            label={<Show when={listing.showLabels}>{props.category.name}</Show>}
            badges={{
                topLeft: (
                    <div class="badge m-[1px] gap-0.5 px-0.5 opacity-50">
                        <For each={props.category.mediaTypes}>
                            {typ => (
                                <MediaTypeIcon
                                    extraClasses={"text-sm text-primary"}
                                    mediaType={typ}
                                />
                            )}
                        </For>
                    </div>
                ),
                topRight: (
                    <FavoriteBadge
                        isFavorite={props.category.isFavorite}
                        subjectId={props.category.id}
                        onToggle={onClickFavorite}
                    />
                )
            }}
        />
    );
};

export default CategoryCard;
