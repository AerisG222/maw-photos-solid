import { Component, createEffect, onCleanup, Show } from "solid-js";

import { useCategoryServices } from "./hooks/useCategoryServices";
import { useCategoryMediaFilters } from "./hooks/useCategoryMediaFilters";
import { MediaViewGrid } from "../_models/MediaView";

import CategoryFilterMenu from "./components/CategoryFilterMenu";
import EmptyState from "../_components/state/EmptyState";
import ViewGrid from "../_media/ViewGrid";

const Grid: Component = () => {
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useCategoryServices(MediaViewGrid);
    const { activeCount, clear } = useCategoryMediaFilters();

    // a photo a filter has just hidden closes rather than leaving an address to nothing
    createEffect(() => mediaService.navigateToViewIfMediaNotInList());

    onCleanup(() => {
        slideshowService.stop();
    });

    return (
        <ViewGrid
            mediaService={mediaService}
            slideshowService={slideshowService}
            showBreadcrumbsOnGrid={true}
            showBreadcrumbsOnMedia={false}
            titleActions={<CategoryFilterMenu />}
            emptyState={
                <Show when={activeCount() > 0}>
                    <EmptyState
                        icon="icon-[ic--round-search-off]"
                        title="No media matches these filters"
                        actionLabel="Clear filters"
                        onAction={clear}
                    />
                </Show>
            }
            isLoading={isLoading()}
            loadError={loadError()}
            onRetry={retryLoad}
            errorTitle="Could not load this category"
        />
    );
};

export default Grid;
