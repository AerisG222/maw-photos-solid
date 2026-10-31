import { Component, createEffect, onCleanup, Show } from "solid-js";

import { MediaViewGrid } from "../../_models/MediaView";
import { placeLink } from "../../places/_routes";
import { usePlaceChain } from "../../places/usePlaceChain";
import { useFeedServices } from "./useFeedServices";

import EmptyClanMessage from "./EmptyClanMessage";
import EmptyState from "../../_components/state/EmptyState";
import PlaceChain from "../../places/components/PlaceChain";
import ToolbarFilters from "./ToolbarFilters";
import ToolbarListing, { LISTING_NAV_COUNT } from "./ToolbarListing";
import ViewGrid from "../ViewGrid";
import FeedFilterMenu from "./FeedFilterMenu";

const Grid: Component = () => {
    const {
        mediaService,
        slideshowService,
        subject,
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

    const filterMenu = () => (
        <FeedFilterMenu favoritesOnly={favoritesOnly()} setFavoritesOnly={setFavoritesOnly} />
    );

    // the empty check comes ahead of everything else: an empty clan answers 404 too
    return (
        <Show when={!subjectIsEmpty()} fallback={<EmptyClanMessage name={subjectName()} />}>
            <ViewGrid
                mediaService={mediaService}
                slideshowService={slideshowService}
                /*
                       A place names itself in its chain, so a title above it
                       would say the same thing twice. A person or a clan has no
                       chain and keeps the title.
                    */
                title={isPlace() ? undefined : subjectName()}
                titleActions={filterMenu()}
                header={
                    <Show when={isPlace()}>
                        <div class="flex flex-wrap items-center justify-between gap-x-6">
                            <PlaceChain links={chain()} link={id => placeLink(id)} />
                            {filterMenu()}
                        </div>
                    </Show>
                }
                toolbarLeadingNavCount={LISTING_NAV_COUNT}
                toolbarLeading={
                    <ToolbarListing
                        subject={subject()}
                        showingCategories={false}
                        favoritesOnly={favoritesOnly()}
                    />
                }
                toolbarExtras={
                    <ToolbarFilters isShuffled={isShuffled()} setShuffled={setShuffled} />
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
                        actionLabel={favoritesOnly() ? "Clear filters" : undefined}
                        onAction={() => setFavoritesOnly(false)}
                    />
                }
                showBreadcrumbsOnGrid={false}
                showBreadcrumbsOnMedia={true}
                isLoading={isLoading()}
                loadError={loadError()}
                onRetry={retryLoad}
                errorTitle={`Could not load media for this ${subjectKindName()}`}
            />
        </Show>
    );
};

export default Grid;
