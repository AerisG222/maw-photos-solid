import { Component, For, Match, Show, Switch } from "solid-js";

import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useMediaGridViewSettingsContext } from "../../_contexts/settings/MediaGridViewSettingsContext";
import { Category } from "../../_models/Category";
import { IsFavoriteRequest } from "../../_models/IsFavoriteRequest";
import { EAGER_THRESHOLD } from "../../_models/utils/Constants";
import { useFeedCategories } from "./useFeedCategories";

import CategoryCard from "../../_components/categories/CategoryCard";
import EmptyClanMessage from "./EmptyClanMessage";
import ErrorMessage from "../../_components/error/ErrorMessage";
import Layout from "../../_components/layout/Layout";
import SkeletonGrid from "../../_components/loading/SkeletonGrid";
import ToolbarCategories from "./ToolbarCategories";

/*
   The categories a person or clan turns up in.

   Paged like the media listing, so it grows on request rather than loading a
   lifetime of categories at once.
*/
const Categories: Component = () => {
    const feed = useFeedCategories();
    const [settings] = useMediaGridViewSettingsContext();
    const { setIsFavoriteMutation } = useCategoriesContext();

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
            title={feed.subjectName()}
            toolbar={
                <ToolbarCategories
                    basePath={feed.basePath()}
                    favoritesOnly={feed.favoritesOnly()}
                    setFavoritesOnly={feed.setFavoritesOnly}
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
                        title={`Could not load categories for this ${
                            feed.isClan() ? "clan" : "person"
                        }`}
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
                                    ? `None of the categories ${feed.subjectPhrase()} appears in have been marked as a favorite.`
                                    : "There is nothing to show here."}
                            </p>
                        }
                    >
                        <div class="flex gap-2 flex-wrap place-content-center mb-4 rise-in">
                            <For each={feed.categories()}>
                                {(category, idx) => (
                                    <CategoryCard
                                        category={category}
                                        showTitles={true}
                                        // somebody turns up across years, so the
                                        // year is part of telling two apart here
                                        showYears={true}
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

                        <Show when={feed.query().hasNextPage}>
                            <div class="flex justify-center my-3">
                                <button
                                    class="btn btn-primary btn-outline"
                                    disabled={feed.query().isFetchingNextPage}
                                    onClick={() => void feed.query().fetchNextPage()}
                                >
                                    <span class="text-lg icon-[ic--round-keyboard-arrow-down]" />
                                    Show More
                                </button>
                            </div>
                        </Show>
                    </Show>
                </Match>
            </Switch>
        </Layout>
    );
};

export default Categories;
