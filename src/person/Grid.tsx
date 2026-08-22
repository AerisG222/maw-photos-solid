import { Component, createEffect, Match, onCleanup, Switch } from "solid-js";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { MediaViewGrid } from "../_models/MediaView";
import { usePersonServices } from "./hooks/usePersonServices";

import ViewGrid from "../_media/ViewGrid";
import ErrorMessage from "../_components/error/ErrorMessage";
import SkeletonGrid from "../_components/loading/SkeletonGrid";
import ToolbarFilters from "./components/ToolbarFilters";

const Grid: Component = () => {
    const {
        mediaService,
        slideshowService,
        person,
        favoritesOnly,
        isShuffled,
        setFavoritesOnly,
        setShuffled,
        isLoading,
        loadError,
        retryLoad
    } = usePersonServices(MediaViewGrid);
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
            <Match when={loadError()}>
                <ErrorMessage
                    title="Could not load media for this person"
                    error={loadError()}
                    onRetry={retryLoad}
                />
            </Match>

            <Match when={!isLoading()}>
                <ViewGrid
                    mediaService={mediaService}
                    slideshowService={slideshowService}
                    gridSettings={settings}
                    title={person()?.name}
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
                                ? `None of the media ${person()?.name ?? "this person"} appears in has been marked as a favorite.`
                                : "There is nothing to show for this person."}
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
