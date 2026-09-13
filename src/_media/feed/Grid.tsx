import { Component, createEffect, onCleanup, Show } from "solid-js";

import { useMediaGridViewSettingsContext } from "../../_contexts/settings/MediaGridViewSettingsContext";
import { MediaViewGrid } from "../../_models/MediaView";
import { getPlacePath } from "../../places/_routes";
import { usePlaceChain } from "../../places/usePlaceChain";
import { useFeedServices } from "./useFeedServices";

import EmptyClanMessage from "./EmptyClanMessage";
import AsyncBoundary from "../../_components/state/AsyncBoundary";
import EmptyState from "../../_components/state/EmptyState";
import PlaceChain from "../../places/components/PlaceChain";
import SkeletonGrid from "../../_components/loading/SkeletonGrid";
import ToolbarFilters from "./ToolbarFilters";
import ToolbarListing, { LISTING_NAV_COUNT } from "./ToolbarListing";
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
    const [settings] = useMediaGridViewSettingsContext();
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

    // the empty check comes ahead of everything else: an empty clan answers 404 too
    return (
        <Show when={!subjectIsEmpty()} fallback={<EmptyClanMessage name={subjectName()} />}>
            <AsyncBoundary
                error={loadError()}
                onRetry={retryLoad}
                errorTitle={`Could not load media for this ${subjectKindName()}`}
                when={!isLoading()}
                skeleton={<SkeletonGrid thumbnailSize={settings.thumbnailSize} />}
            >
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
                    toolbarLeadingNavCount={LISTING_NAV_COUNT}
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
                        <EmptyState
                            icon="icon-[ic--round-photo-library]"
                            title={
                                favoritesOnly()
                                    ? "No favorites here yet"
                                    : "There is nothing to show here"
                            }
                            detail={
                                favoritesOnly()
                                    ? `None of the media ${mediaScope()} has been marked as a favorite.`
                                    : undefined
                            }
                        />
                    }
                    showBreadcrumbsOnGrid={false}
                    showBreadcrumbsOnMedia={true}
                    showFavoritesBadge={settings.showFavoritesBadge}
                    showTypesBadge={settings.showTypesBadge}
                />
            </AsyncBoundary>
        </Show>
    );
};

export default Grid;
