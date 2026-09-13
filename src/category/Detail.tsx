import { Component, createEffect, onCleanup } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { MediaViewDetail } from "../_models/MediaView";
import { useCategoryServices } from "./hooks/useCategoryServices";

import ViewDetail from "../_media/ViewDetail";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import Loading from "../_components/loading/Loading";

const Detail: Component = () => {
    const [settings] = useMediaDetailViewSettingsContext();
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useCategoryServices(MediaViewDetail);

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <AsyncBoundary
            error={loadError()}
            onRetry={retryLoad}
            errorTitle="Could not load this category"
            when={!isLoading()}
            skeleton={<Loading />}
        >
            <ViewDetail
                mediaService={mediaService}
                slideshowService={slideshowService}
                detailSettings={settings}
                showBreadcrumbTitleAsLink={false}
                enableCategoryDownload={true}
                enableCategoryTeaserChooser={true}
                showFavoritesBadge={settings.showFavoritesBadge}
            />
        </AsyncBoundary>
    );
};

export default Detail;
