import { Component, For, Show } from "solid-js";

import { Category } from "../../_models/Category";
import { linkOptions } from "@tanstack/solid-router";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";
import {
    LabelArea,
    useListingSettingsContext
} from "../../_contexts/settings/ListingSettingsContext";

import FavoriteBadge from "../listing/FavoriteBadge";
import MediaTypeIcon from "../icon/MediaTypeIcon";
import Tile from "../listing/Tile";
import { categoryRoute } from "../../category/_routeTree";

interface Props {
    category: Category;
    // the listing it is in, which decides whether its labels show
    area: LabelArea;
    // left out where a heading above already says it - the year's own listing
    hideYear?: boolean;
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
            link={linkOptions({
                to: categoryRoute.to,
                params: {
                    categoryYear: String(props.category.year),
                    categorySlug: props.category.slug
                }
            })}
            src={getMediaTeaserUrl(props.category.teaser)}
            surface
            // the whole name wherever the label cannot show it - hidden, or cut short
            title={props.category.name}
            eager={props.eager}
            header={
                <Show when={listing.labels[props.area] && !props.hideYear}>
                    <div class="text-center leading-6">
                        {props.category.effectiveDate.getFullYear()}
                    </div>
                </Show>
            }
            label={<Show when={listing.labels[props.area]}>{props.category.name}</Show>}
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
