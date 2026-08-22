import { Component, createEffect, Match, onCleanup, Switch } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { MediaViewDetail } from "../_models/MediaView";
import { usePersonServices } from "./hooks/usePersonServices";

import ViewDetail from "../_media/ViewDetail";
import ErrorMessage from "../_components/error/ErrorMessage";
import Loading from "../_components/loading/Loading";

const Detail: Component = () => {
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        usePersonServices(MediaViewDetail);
    const [settings, { setShowFavoritesBadge }] = useMediaDetailViewSettingsContext();

    // see the note in Grid: nothing can be decided before the first page lands
    createEffect(() => {
        if (!isLoading()) {
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
            <Match when={loadError()}>
                <ErrorMessage
                    title="Could not load media for this person"
                    error={loadError()}
                    onRetry={retryLoad}
                />
            </Match>

            <Match when={!isLoading()}>
                <ViewDetail
                    mediaService={mediaService}
                    slideshowService={slideshowService}
                    detailSettings={settings}
                    showBreadcrumbTitleAsLink={true}
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
