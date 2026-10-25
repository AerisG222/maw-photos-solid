import { Component, Match, Show, Switch } from "solid-js";
import { LinkOptions } from "@tanstack/solid-router";

import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { EAGER_THRESHOLD } from "../../_models/utils/Constants";
import { useBrowsedMedia } from "../hooks/useBrowsedMedia";

import CategoryBreadcrumb from "../../_components/categories/CategoryBreadcrumb";
import ErrorMessage from "../../_components/error/ErrorMessage";
import ListingSurface from "../../_components/listing/ListingSurface";
import { mediaRowHeight } from "../../_components/listing/_rows";
import { ThumbnailSizeDefault, getThumbnailSize } from "../../_models/ThumbnailSize";

const MEDIA_ROW_HEIGHT = mediaRowHeight(getThumbnailSize(ThumbnailSizeDefault).height);
import SkeletonGrid from "../../_components/loading/SkeletonGrid";
import MediaLink from "../../_media/MediaLink";
import YearHeading from "./YearHeading";

interface Props {
    category: Category;
    // the first category of its year opens with the year's heading, as the grid does
    showYear: boolean;
    // whether to load its first images eagerly - the first category only, which is the top of the page
    eager: boolean;
    mediaLink: (media: Media) => LinkOptions;
    setIsFavorite: (media: Media, isFavorite: boolean) => void;
}

/*
   One category and its photos, while browsing them all.

   The header sticks to the top of the page for as long as any of this
   category's photos are on screen, and goes with them as the next category
   arrives - that is what `sticky` does inside a box of its own, so there is no
   scroll handler working out which one to show.

   The photos are asked for when this mounts, and the listing only mounts the
   categories near the screen - so scrolling is what loads them.
*/
const BrowseSection: Component<Props> = props => {
    const browsed = useBrowsedMedia(() => props.category.id);

    return (
        <section class="pb-2">
            <Show when={props.showYear}>
                <YearHeading year={props.category.year} />
            </Show>

            <header class="sticky top-0 z-20 bg-base-100/90 backdrop-blur-sm py-1 border-b border-base-content/10">
                <CategoryBreadcrumb showTitleAsLink category={props.category} />
            </header>

            <Switch fallback={<SkeletonGrid count={6} />}>
                <Match when={browsed.error()}>
                    <ErrorMessage
                        title={`Could not load the photos in ${props.category.name}`}
                        error={browsed.error()}
                        onRetry={browsed.retry}
                    />
                </Match>

                <Match when={browsed.media()}>
                    {media => (
                        <Show
                            when={media().length > 0}
                            fallback={
                                <p class="text-sm text-muted text-center my-2">
                                    Nothing here matches the filters.
                                </p>
                            }
                        >
                            {/*
                                Windowed like any grid, so a category of
                                hundreds draws only the rows on screen - the
                                category itself is one box in the listing, and
                                its photos are windowed inside it.
                            */}
                            <ListingSurface
                                class="mt-2"
                                nested
                                estimatedRowHeight={MEDIA_ROW_HEIGHT}
                                items={media()}
                            >
                                {(item, index) => (
                                    <MediaLink
                                        link={props.mediaLink(item)}
                                        media={item}
                                        eager={props.eager && index <= EAGER_THRESHOLD}
                                        setIsFavorite={props.setIsFavorite}
                                    />
                                )}
                            </ListingSurface>
                        </Show>
                    )}
                </Match>
            </Switch>
        </section>
    );
};

export default BrowseSection;
