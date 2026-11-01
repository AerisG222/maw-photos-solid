import { Component, Show } from "solid-js";
import ListingSurface from "../../_components/listing/ListingSurface";

import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { EAGER_THRESHOLD } from "../../_models/utils/Constants";
import { placeLink } from "../../places/_routes";
import { usePlaceChain } from "../../places/usePlaceChain";
import { useFeedCategories } from "./useFeedCategories";

import { useCategoryRowHeight } from "../../_components/categories/useCategoryRowHeight";
import CategoryCard from "../../_components/categories/CategoryCard";
import EmptyClanMessage from "./EmptyClanMessage";
import AsyncBoundary from "../../_components/state/AsyncBoundary";
import EmptyState from "../../_components/state/EmptyState";
import Layout from "../../_components/layout/Layout";
import PlaceChain from "../../places/components/PlaceChain";
import SkeletonGrid from "../../_components/loading/SkeletonGrid";
import ToolbarCategories from "./ToolbarCategories";
import { favoriteSetter } from "../../_models/utils/FavoriteUtils";
import FeedFilterMenu from "./FeedFilterMenu";
import LoadMore from "../../_components/listing/LoadMore";

/*
   The categories a person or clan turns up in, or the ones holding media taken at
   a place.

   Paged like the media listing, so it grows on request rather than loading a
   lifetime of categories at once.
*/
const Categories: Component = () => {
    const feed = useFeedCategories();
    const { setIsFavoriteMutation } = useCategoriesContext();
    const chain = usePlaceChain(feed.placeId);
    const rowHeight = useCategoryRowHeight();

    const setIsFavorite = favoriteSetter(setIsFavoriteMutation);

    const filterMenu = () => (
        <FeedFilterMenu
            favoritesOnly={feed.favoritesOnly()}
            mediaType={feed.mediaType()}
            setFavoritesOnly={feed.setFavoritesOnly}
            setMediaType={feed.setMediaType}
            clearFilters={feed.clearFilters}
        />
    );

    return (
        <Layout
            // see the note in the media listing: a place names itself in its chain
            title={feed.isPlace() ? undefined : feed.subjectName()}
            titleActions={filterMenu()}
            header={
                <Show when={feed.isPlace()}>
                    <div class="flex flex-wrap items-center justify-between gap-x-6">
                        <PlaceChain links={chain()} link={id => placeLink(id)} />
                        {filterMenu()}
                    </div>
                </Show>
            }
            toolbar={
                <ToolbarCategories
                    subject={feed.subject()}
                    favoritesOnly={feed.favoritesOnly()}
                    mediaType={feed.mediaType()}
                />
            }
        >
            {/* checked ahead of everything else: an empty clan answers 404 too */}
            <Show
                when={!feed.subjectIsEmpty()}
                fallback={<EmptyClanMessage name={feed.subjectName()} />}
            >
                <AsyncBoundary
                    error={feed.loadError()}
                    onRetry={feed.retryLoad}
                    errorTitle={`Could not load categories for this ${feed.subjectKindName()}`}
                    when={!feed.isLoading()}
                    skeleton={<SkeletonGrid />}
                    isEmpty={feed.categories().length === 0}
                    empty={
                        <EmptyState
                            icon="icon-[ic--round-collections]"
                            title={
                                feed.mediaType()
                                    ? "No categories match these filters"
                                    : feed.favoritesOnly()
                                      ? "No favorites here yet"
                                      : "There is nothing to show here"
                            }
                            detail={
                                feed.favoritesOnly() && !feed.mediaType()
                                    ? `None of the categories ${feed.categoryScope()} have been marked as a favorite.`
                                    : undefined
                            }
                            actionLabel={
                                feed.favoritesOnly() || feed.mediaType()
                                    ? "Clear filters"
                                    : undefined
                            }
                            onAction={feed.clearFilters}
                        />
                    }
                >
                    <ListingSurface
                        animate
                        class="mb-4"
                        estimatedRowHeight={rowHeight()}
                        items={feed.categories()}
                    >
                        {(category, index) => (
                            <CategoryCard
                                category={category}
                                eager={index <= EAGER_THRESHOLD}
                                setIsFavorite={setIsFavorite}
                            />
                        )}
                    </ListingSurface>

                    <LoadMore
                        hasMore={feed.query().hasNextPage}
                        isLoading={feed.query().isFetchingNextPage}
                        failed={feed.query().isFetchNextPageError}
                        onLoad={() => void feed.query().fetchNextPage()}
                    />
                </AsyncBoundary>
            </Show>
        </Layout>
    );
};

export default Categories;
