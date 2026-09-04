import { Component, For, Match, Show, Switch } from "solid-js";

import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useFeedCategoryViewSettingsContext } from "../../_contexts/settings/FeedCategoryViewSettingsContext";
import { Category } from "../../_models/Category";
import { IsFavoriteRequest } from "../../_models/IsFavoriteRequest";
import { EAGER_THRESHOLD } from "../../_models/utils/Constants";
import { getPlacePath } from "../../places/_routes";
import { usePlaceChain } from "../../places/usePlaceChain";
import { useFeedCategories } from "./useFeedCategories";

import CategoryCard from "../../_components/categories/CategoryCard";
import EmptyClanMessage from "./EmptyClanMessage";
import ErrorMessage from "../../_components/error/ErrorMessage";
import Layout from "../../_components/layout/Layout";
import PlaceChain from "../../places/components/PlaceChain";
import SkeletonGrid from "../../_components/loading/SkeletonGrid";
import ToolbarCategories from "./ToolbarCategories";

/*
   The categories a person or clan turns up in, or the ones holding media taken at
   a place.

   Paged like the media listing, so it grows on request rather than loading a
   lifetime of categories at once.
*/
const Categories: Component = () => {
    const feed = useFeedCategories();
    const [settings] = useFeedCategoryViewSettingsContext();
    const { setIsFavoriteMutation } = useCategoriesContext();
    const chain = usePlaceChain(feed.placeId);

    const setIsFavorite = (category: Category, isFavorite: boolean) => {
        const req: IsFavoriteRequest<Category> = {
            item: category,
            isFavorite
        };

        setIsFavoriteMutation.mutate(req);
    };

    return (
        <Layout
            margin={settings.margin}
            // see the note in the media listing: a place names itself in its chain
            title={feed.isPlace() ? undefined : feed.subjectName()}
            header={
                <Show when={feed.isPlace()}>
                    <PlaceChain links={chain()} buildPath={getPlacePath} />
                </Show>
            }
            toolbar={
                <ToolbarCategories
                    basePath={feed.basePath()}
                    favoritesOnly={feed.favoritesOnly()}
                    canRequestMore={feed.query().hasNextPage}
                    setFavoritesOnly={feed.setFavoritesOnly}
                    requestMore={() => void feed.query().fetchNextPage()}
                />
            }
        >
            <Switch fallback={<SkeletonGrid thumbnailSize={settings.thumbnailSize} />}>
                {/* checked before the error: an empty clan answers 404 too */}
                <Match when={feed.subjectIsEmpty()}>
                    <EmptyClanMessage name={feed.subjectName()} />
                </Match>

                <Match when={feed.loadError()}>
                    <ErrorMessage
                        title={`Could not load categories for this ${feed.subjectKindName()}`}
                        error={feed.loadError()}
                        onRetry={feed.retryLoad}
                    />
                </Match>

                <Match when={!feed.isLoading()}>
                    <Show
                        when={feed.categories().length > 0}
                        fallback={
                            <p class="text-center my-8">
                                {feed.favoritesOnly()
                                    ? `None of the categories ${feed.categoryScope()} have been marked as a favorite.`
                                    : "There is nothing to show here."}
                            </p>
                        }
                    >
                        <div class="flex gap-2 flex-wrap place-content-center mb-4 rise-in">
                            <For each={feed.categories()}>
                                {(category, idx) => (
                                    <CategoryCard
                                        category={category}
                                        showTitles={settings.showTitles}
                                        showYears={settings.showYears}
                                        thumbnailSize={settings.thumbnailSize}
                                        dimThumbnails={settings.dimThumbnails}
                                        showFavoriteBadge={settings.showFavoritesBadge}
                                        showTypesBadge={settings.showTypesBadge}
                                        eager={idx() <= EAGER_THRESHOLD}
                                        setIsFavorite={setIsFavorite}
                                    />
                                )}
                            </For>
                        </div>
                    </Show>
                </Match>
            </Switch>
        </Layout>
    );
};

export default Categories;
