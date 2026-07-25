import { Component, createEffect, Match, onCleanup, Switch } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { MediaViewDetail } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";

import ViewDetail from "../_media/ViewDetail";
import ErrorMessage from "../_components/error/ErrorMessage";
import Loading from "../_components/loading/Loading";

const Detail: Component = () => {
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useRandomServices(MediaViewDetail);
    const [settings, { setShowFavoritesBadge }] = useMediaDetailViewSettingsContext();

    createEffect(() => {
        mediaService.navigateToFirstMediaIfNeeded();
        mediaService.navigateToViewIfMediaNotInList();
    });

    onCleanup(() => {
        slideshowService.stop();
        mediaService.stopPeriodicFetching();
    });

    return (
        // a single photo, so a spinner rather than skeleton tiles
        <Switch fallback={<Loading />}>
            <Match when={loadError()}>
                <ErrorMessage
                    title="Could not load random media"
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
