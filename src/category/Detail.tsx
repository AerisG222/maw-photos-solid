import { Component, createEffect, Match, onCleanup, Switch } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { MediaViewDetail } from "../_models/MediaView";
import { useCategoryServices } from "./hooks/useCategoryServices";

import ViewDetail from "../_media/ViewDetail";
import ErrorMessage from "../_components/error/ErrorMessage";
import Loading from "../_components/loading/Loading";

const Detail: Component = () => {
    const [settings, { setShowFavoritesBadge }] = useMediaDetailViewSettingsContext();
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useCategoryServices(MediaViewDetail);

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <Switch fallback={<Loading />}>
            <Match when={loadError()}>
                <ErrorMessage
                    title="Could not load this category"
                    error={loadError()}
                    onRetry={retryLoad}
                />
            </Match>

            <Match when={!isLoading()}>
                <ViewDetail
                    mediaService={mediaService}
                    slideshowService={slideshowService}
                    detailSettings={settings}
                    showBreadcrumbTitleAsLink={false}
                    enableCategoryTeaserChooser={true}
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
