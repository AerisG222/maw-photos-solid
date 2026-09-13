import { Component, createEffect, onCleanup } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { MediaViewDetail } from "../_models/MediaView";
import { useRandomServices } from "./hooks/useRandomService";

import ViewDetail from "../_media/ViewDetail";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import Loading from "../_components/loading/Loading";

const Detail: Component = () => {
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useRandomServices(MediaViewDetail);
    const [settings] = useMediaDetailViewSettingsContext();

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
        <AsyncBoundary
            error={loadError()}
            onRetry={retryLoad}
            errorTitle="Could not load random media"
            when={!isLoading()}
            skeleton={<Loading />}
        >
            <ViewDetail
                mediaService={mediaService}
                slideshowService={slideshowService}
                detailSettings={settings}
                showBreadcrumbTitleAsLink={true}
                enableCategoryDownload={false}
                enableCategoryTeaserChooser={false}
                showFavoritesBadge={settings.showFavoritesBadge}
            />
        </AsyncBoundary>
    );
};

export default Detail;
