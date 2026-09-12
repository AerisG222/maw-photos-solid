import { Component, Show, createEffect, onCleanup } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../../_contexts/settings/MediaDetailViewSettingsContext";
import { MediaViewDetail } from "../../_models/MediaView";
import { useFeedServices } from "./useFeedServices";

import EmptyClanMessage from "./EmptyClanMessage";
import AsyncBoundary from "../../_components/state/AsyncBoundary";
import Loading from "../../_components/loading/Loading";
import ToolbarFilters from "./ToolbarFilters";
import ToolbarListing, { LISTING_NAV_COUNT } from "./ToolbarListing";
import ViewDetail from "../ViewDetail";

const Detail: Component = () => {
    const {
        mediaService,
        slideshowService,
        subjectName,
        subjectIsEmpty,
        subjectKindName,
        basePath,
        favoritesOnly,
        isShuffled,
        setFavoritesOnly,
        setShuffled,
        isLoading,
        loadError,
        retryLoad
    } = useFeedServices(MediaViewDetail);
    const [settings, { setShowFavoritesBadge }] = useMediaDetailViewSettingsContext();

    /*
       See the note in Grid: nothing can be decided before the first page lands.
       An empty feed hands back to the grid, the one view that can show that a
       filter matched nothing rather than rendering blank.
    */
    createEffect(() => {
        if (!isLoading() && !mediaService.navigateToGridIfEmpty()) {
            mediaService.navigateToFirstMediaIfNeeded();
            mediaService.navigateToViewIfMediaNotInList();
        }
    });

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        // a single photo, so a spinner rather than skeleton tiles
        <Show when={!subjectIsEmpty()} fallback={<EmptyClanMessage name={subjectName()} />}>
            <AsyncBoundary
                error={loadError()}
                onRetry={retryLoad}
                errorTitle={`Could not load media for this ${subjectKindName()}`}
                when={!isLoading()}
                skeleton={<Loading />}
            >
                <ViewDetail
                    mediaService={mediaService}
                    slideshowService={slideshowService}
                    toolbarLeadingNavCount={LISTING_NAV_COUNT}
                    toolbarLeading={
                        <ToolbarListing
                            basePath={basePath()}
                            showingCategories={false}
                            favoritesOnly={favoritesOnly()}
                        />
                    }
                    toolbarExtras={
                        <ToolbarFilters
                            favoritesOnly={favoritesOnly()}
                            isShuffled={isShuffled()}
                            setFavoritesOnly={setFavoritesOnly}
                            setShuffled={setShuffled}
                        />
                    }
                    detailSettings={settings}
                    showBreadcrumbTitleAsLink={true}
                    enableCategoryDownload={false}
                    enableCategoryTeaserChooser={false}
                    showFavoritesBadge={settings.showFavoritesBadge}
                    setShowFavoritesBadge={() =>
                        setShowFavoritesBadge(!settings.showFavoritesBadge)
                    }
                />
            </AsyncBoundary>
        </Show>
    );
};

export default Detail;
