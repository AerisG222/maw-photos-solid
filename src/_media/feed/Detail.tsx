import { Component, createEffect, Match, onCleanup, Switch } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../../_contexts/settings/MediaDetailViewSettingsContext";
import { MediaViewDetail } from "../../_models/MediaView";
import { getPlacePath } from "../../places/_routes";
import { useFeedServices } from "./useFeedServices";

import EmptyClanMessage from "./EmptyClanMessage";
import ErrorMessage from "../../_components/error/ErrorMessage";
import Loading from "../../_components/loading/Loading";
import ToolbarFilters from "./ToolbarFilters";
import ToolbarListing from "./ToolbarListing";
import ViewDetail from "../ViewDetail";

const Detail: Component = () => {
    const {
        mediaService,
        slideshowService,
        subjectName,
        subjectIsEmpty,
        subjectKindName,
        isPlace,
        placeId,
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
        <Switch fallback={<Loading />}>
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
                <ViewDetail
                    mediaService={mediaService}
                    slideshowService={slideshowService}
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
                    detailSettings={settings}
                    showBreadcrumbTitleAsLink={true}
                    enableCategoryDownload={false}
                    enableCategoryTeaserChooser={false}
                    showFavoritesBadge={settings.showFavoritesBadge}
                    setShowFavoritesBadge={() =>
                        setShowFavoritesBadge(!settings.showFavoritesBadge)
                    }
                />
            </Match>
        </Switch>
    );
};

export default Detail;
