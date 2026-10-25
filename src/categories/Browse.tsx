import { Component, createMemo, onCleanup } from "solid-js";
import { getRouteApi } from "@tanstack/solid-router";

import { useCategoriesByYear } from "./hooks/useCategoriesByYear";
import { useBrowsedMedia } from "./hooks/useBrowsedMedia";
import { BrowseMediaService } from "./services/BrowseMediaService";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { useMediaSettingsContext } from "../_contexts/settings/MediaSettingsContext";
import { useGoTo } from "../_media/services/_navigation";
import { SlideshowService } from "../_media/services/SlideshowService";
import { Category } from "../_models/Category";
import { MediaViewGrid } from "../_models/MediaView";
import { favoriteSetter } from "../_models/utils/FavoriteUtils";

import BrowseListing from "./components/BrowseListing";
import BrowseToggle from "./components/BrowseToggle";
import CategoriesNav, { CATEGORIES_NAV_COUNT } from "./components/CategoriesNav";
import CategoryFilterBar from "./components/CategoryFilterBar";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import SkeletonGrid from "../_components/loading/SkeletonGrid";
import ViewGrid from "../_media/ViewGrid";

const route = getRouteApi("/categories");

/*
   The categories grid, browsing every category's photos rather than a card for
   each - the same categories, in the same order, under the same filters.

   A photo opens over the listing as it does in a category's own grid: next and
   previous, the Inspector, the slideshow, fullscreen. That is the category grid
   itself, handed this listing to draw instead of one category's photos, and a
   media service that reads the open photo from this page's search rather than
   from a route of its own - see BrowseMediaService.
*/
const Browse: Component = () => {
    const { categoriesToDisplay, loadError, retryLoad } = useCategoriesByYear();
    const { categoryQuery } = useCategoriesContext();
    const { setIsFavoriteMutation } = useMediaContext();
    const [mediaSettings] = useMediaSettingsContext();
    const search = route.useSearch();
    const goTo = useGoTo();

    // the open photo's category, as browsing shows it - so next and previous see what the listing does
    const openCategoryId = () => search().category;
    const openCategory = categoryQuery(openCategoryId);
    const openMedia = useBrowsedMedia(openCategoryId);

    const mediaService = new BrowseMediaService(goTo, search, () => openCategory, openMedia.media);
    const slideshowService = new SlideshowService(mediaService, mediaSettings.slideshowSeconds);

    onCleanup(() => slideshowService.stop());

    // newest year first, each year's categories as the grid lists them
    const categories = createMemo<Category[]>(() => {
        const byYear = categoriesToDisplay();

        if (!byYear) {
            return [];
        }

        return Object.keys(byYear)
            .map(year => parseInt(year, 10))
            .sort((a, b) => b - a)
            .flatMap(year => byYear[year] ?? []);
    });

    return (
        <ViewGrid
            mediaService={mediaService}
            slideshowService={slideshowService}
            toolbarLeading={<CategoriesNav />}
            toolbarLeadingNavCount={CATEGORIES_NAV_COUNT}
            toolbarExtras={<BrowseToggle />}
            showBreadcrumbsOnGrid={false}
            showBreadcrumbsOnMedia={true}
            listing={
                <AsyncBoundary
                    error={loadError()}
                    onRetry={retryLoad}
                    errorTitle="Could not load categories"
                    when={categoriesToDisplay()}
                    skeleton={<SkeletonGrid />}
                >
                    <CategoryFilterBar />

                    <BrowseListing
                        categories={categories()}
                        mediaLink={media => mediaService.getMediaLinkByView(MediaViewGrid, media)}
                        setIsFavorite={favoriteSetter(setIsFavoriteMutation)}
                    />
                </AsyncBoundary>
            }
        />
    );
};

export default Browse;
