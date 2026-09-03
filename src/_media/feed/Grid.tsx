import { Component, createEffect, Match, onCleanup, Switch } from "solid-js";

import { useMediaGridViewSettingsContext } from "../../_contexts/settings/MediaGridViewSettingsContext";
import { MediaViewGrid } from "../../_models/MediaView";
import { getPlacePath } from "../../places/_routes";
import { useFeedServices } from "./useFeedServices";

import EmptyClanMessage from "./EmptyClanMessage";
import ErrorMessage from "../../_components/error/ErrorMessage";
import SkeletonGrid from "../../_components/loading/SkeletonGrid";
import ToolbarFilters from "./ToolbarFilters";
import ToolbarListing from "./ToolbarListing";
import ViewGrid from "../ViewGrid";

const Grid: Component = () => {
    const {
        mediaService,
        slideshowService,
        basePath,
        subjectName,
        mediaScope,
        subjectIsEmpty,
        subjectKindName,
        isPlace,
        placeId,
        favoritesOnly,
        isShuffled,
        setFavoritesOnly,
        setShuffled,
        isLoading,
        loadError,
        retryLoad
    } = useFeedServices(MediaViewGrid);
    const [settings, { setShowFavoritesBadge, setShowTypesBadge }] =
        useMediaGridViewSettingsContext();

    /*
       Held until the first page has landed. Deciding earlier would rewrite a
       deep link to a specific photo before there was any list to find it in.
    */
    createEffect(() => {
        if (!isLoading()) {
            mediaService.navigateToViewIfMediaNotInList();
        }
    });

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <Switch fallback={<SkeletonGrid thumbnailSize={settings.thumbnailSize} />}>
            {/* checked before the error: an empty clan answers 404 too */}
            <Match when={subjectIsEmpty()}>
                <EmptyClanMessage name={subjectName()} />
            </Match>

            <Match when={loadError()}>
                <ErrorMessage
                    title={`Could not load media for this ${subjectKindName()}`}
                    error={loadError()}
                    onRetry={retryLoad}
                />
            </Match>

            <Match when={!isLoading()}>
                <ViewGrid
                    mediaService={mediaService}
                    slideshowService={slideshowService}
                    gridSettings={settings}
                    title={subjectName()}
                    toolbarLeading={
                        <ToolbarListing
                            basePath={basePath()}
                            showingCategories={false}
                            favoritesOnly={favoritesOnly()}
                            upHref={isPlace() ? getPlacePath(placeId()) : undefined}
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
                    emptyState={
                        <p class="text-center my-8">
                            {favoritesOnly()
                                ? `None of the media ${mediaScope()} has been marked as a favorite.`
                                : "There is nothing to show here."}
                        </p>
                    }
                    showBreadcrumbsOnGrid={false}
                    showBreadcrumbsOnMedia={settings.showMainBreadcrumbs}
                    enableToggleBreadcrumbsOnActiveMedia={true}
                    enableToggleBreadcrumbsOnInactiveMedia={false}
                    showFavoritesBadge={settings.showFavoritesBadge}
                    showTypesBadge={settings.showTypesBadge}
                    setShowFavoritesBadge={() =>
                        setShowFavoritesBadge(!settings.showFavoritesBadge)
                    }
                    setShowTypesBadge={() => setShowTypesBadge(!settings.showTypesBadge)}
                />
            </Match>
        </Switch>
    );
};

export default Grid;
