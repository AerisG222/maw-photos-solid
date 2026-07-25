import { Component, createEffect, createSignal, For, Show } from "solid-js";

import { useSearchGridViewSettingsContext } from "../_contexts/settings/SearchGridViewSettingsContext";
import { useSearchContext } from "./contexts/SearchContext";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";
import { Category } from "../_models/Category";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";

import Toolbar from "./components/Toolbar";
import GridToolbar from "./components/ToolbarGrid";
import Layout from "../_components/layout/Layout";
import SearchBar from "./components/SearchBar";
import CategoryCard from "../_components/categories/CategoryCard";
import SearchResultStatus from "./components/SearchResultStatus";
import ErrorMessage from "../_components/error/ErrorMessage";

const ViewGrid: Component = () => {
    const [settings] = useSearchGridViewSettingsContext();
    const [state, { categorySearchQuery, allSearchResults, setIsFavoriteMutation }] =
        useSearchContext();
    const [searchQuery, setSearchQuery] = createSignal(categorySearchQuery(state.activeTerm));

    createEffect(() => {
        setSearchQuery(categorySearchQuery(state.activeTerm));
    });

    const setIsFavorite = (category: Category, isFavorite: boolean) => {
        const req: IsFavoriteRequest<Category> = {
            item: category,
            isFavorite
        };

        setIsFavoriteMutation.mutate(req);
    };

    return (
        <Layout
            toolbar={
                <Toolbar>
                    <GridToolbar />
                </Toolbar>
            }
            margin={settings.margin}
        >
            <div class="mt-4">
                <SearchBar />
            </div>

            {/* the toolbar and search bar stay put so the term can be retried or edited */}
            <Show
                when={!searchQuery().isError}
                fallback={
                    <ErrorMessage
                        title="Search could not be completed"
                        error={searchQuery().error}
                        onRetry={() => void searchQuery().refetch()}
                    />
                }
            >
                <div class="flex gap-2 flex-wrap place-content-center my-4">
                    <For each={allSearchResults(searchQuery()) ?? []}>
                        {(category, idx) => (
                            <CategoryCard
                                category={category}
                                showTitles={settings.showTitles}
                                thumbnailSize={settings.thumbnailSize}
                                dimThumbnails={settings.dimThumbnails}
                                showYears={settings.showYears}
                                showFavoriteBadge={settings.showFavoritesBadge}
                                showTypesBadge={settings.showTypesBadge}
                                eager={idx() <= EAGER_THRESHOLD}
                                setIsFavorite={setIsFavorite}
                            />
                        )}
                    </For>
                </div>

                <SearchResultStatus
                    hasMore={searchQuery().hasNextPage}
                    continueSearch={() => searchQuery().fetchNextPage()}
                />
            </Show>
        </Layout>
    );
};

export default ViewGrid;
