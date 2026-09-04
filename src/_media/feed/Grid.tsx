import { Component, createEffect, Match, onCleanup, Show, Switch } from "solid-js";

import { useMediaGridViewSettingsContext } from "../../_contexts/settings/MediaGridViewSettingsContext";
import { MediaViewGrid } from "../../_models/MediaView";
import { getPlacePath } from "../../places/_routes";
import { usePlaceChain } from "../../places/usePlaceChain";
import { useFeedServices } from "./useFeedServices";

import EmptyClanMessage from "./EmptyClanMessage";
import ErrorMessage from "../../_components/error/ErrorMessage";
import PlaceChain from "../../places/components/PlaceChain";
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
    const chain = usePlaceChain(placeId);

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
                    /*
                       A place names itself in its chain, so a title above it
                       would say the same thing twice. A person or a clan has no
                       chain and keeps the title.
                    */
                    title={isPlace() ? undefined : subjectName()}
                    header={
                        <Show when={isPlace()}>
                            <PlaceChain links={chain()} buildPath={getPlacePath} />
                        </Show>
                    }
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
