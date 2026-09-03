import { Component, For, Match, Show, Switch, createMemo } from "solid-js";

import { usePlacesContext } from "../../_contexts/api/PlacesContext";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";
import { getThumbnailSize, ThumbnailSizeSmall } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";
import { Uuid } from "../../_models/Uuid";

import ErrorMessage from "../../_components/error/ErrorMessage";
import Icon from "../../_components/icon/Icon";
import SkeletonGrid from "../../_components/loading/SkeletonGrid";

interface Props {
    placeId: Uuid | undefined;
    favoritesOnly: boolean;
    onSelect: (category: Category) => void;
}

/*
   The categories holding media taken at a place - the other way into the same
   photographs.

   Remembering the outing is usually faster than paging a country's whole feed,
   which is the problem this solves: "the cover for Thailand is in that trip"
   takes two clicks, where scrolling for it takes hundreds.
*/
const PlaceCoverCategories: Component<Props> = props => {
    const { placeCategoriesQuery } = usePlacesContext();

    const placeId = () => props.placeId;
    const favoritesOnly = () => props.favoritesOnly;
    // eslint-disable-next-line solid/reactivity -- both are accessors, and the query re-keys itself when either changes
    const categories = placeCategoriesQuery(placeId, favoritesOnly);

    const items = createMemo(() => {
        const results: Category[] = [];

        for (const page of categories.data?.pages ?? []) {
            if (page) {
                results.push(...page.results);
            }
        }

        return results;
    });

    const size = () => getThumbnailSize(ThumbnailSizeSmall);

    return (
        <Switch fallback={<SkeletonGrid thumbnailSize={ThumbnailSizeSmall} count={12} />}>
            <Match when={categories.isError}>
                <ErrorMessage
                    title="Could not load the categories at this place"
                    error={categories.error}
                    onRetry={() => void categories.refetch()}
                />
            </Match>

            <Match when={categories.isSuccess}>
                <Show
                    when={items().length > 0}
                    fallback={
                        <p class="text-center my-8">
                            {props.favoritesOnly
                                ? "None of the categories here has been favorited."
                                : "Nothing here belongs to a category you can see."}
                        </p>
                    }
                >
                    <div class="flex gap-2 flex-wrap place-content-center">
                        <For each={items()}>
                            {category => (
                                <button
                                    class="flex flex-col border-1 border-secondary/20 rounded-sm overflow-hidden
                                        cursor-pointer hover:border-primary hover:text-primary"
                                    style={{ width: `${size().width}px` }}
                                    title={`${category.name} (${category.year})`}
                                    onClick={() => props.onSelect(category)}
                                >
                                    <img
                                        src={getMediaTeaserUrl(category.teaser, ThumbnailSizeSmall)}
                                        class="block w-full object-cover"
                                        style={{ height: `${size().height}px` }}
                                        loading="lazy"
                                    />

                                    <span class="w-full truncate px-1 text-xs">
                                        {category.name}
                                    </span>
                                    <span class="w-full truncate px-1 text-xs opacity-70">
                                        {category.year}
                                    </span>
                                </button>
                            )}
                        </For>
                    </div>

                    <Show when={categories.hasNextPage}>
                        <div class="flex justify-center my-3">
                            <button
                                class="btn btn-sm btn-primary btn-outline"
                                disabled={categories.isFetchingNextPage}
                                onClick={() => void categories.fetchNextPage()}
                            >
                                <Icon classes="icon-[ic--round-fast-forward]" />
                                Request More
                            </button>
                        </div>
                    </Show>
                </Show>
            </Match>
        </Switch>
    );
};

export default PlaceCoverCategories;
