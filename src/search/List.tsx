import { Component, createEffect, createSignal, For } from "solid-js";

import { useSearchListViewSettingsContext } from "../_contexts/settings/SearchListViewSettingsContext";
import { useSearchContext } from "./contexts/SearchContext";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";
import { Category } from "../_models/Category";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";

import Toolbar from "./components/Toolbar";
import ListToolbar from "./components/ToolbarList";
import Layout from "../_components/layout/Layout";
import SearchBar from "./components/SearchBar";
import CategoryListItem from "../_components/categories/CategoryListItem";
import SearchResultStatus from "./components/SearchResultStatus";

const ViewList: Component = () => {
    const [settings] = useSearchListViewSettingsContext();
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
                    <ListToolbar />
                </Toolbar>
            }
            margin={settings.margin}
        >
            <div class="mt-4">
                <SearchBar />
            </div>

            <div class="my-4">
                <For each={allSearchResults(searchQuery()) ?? []}>
                    {(category, idx) => (
                        <CategoryListItem
                            category={category}
                            showYear={true}
                            thumbnailSize={settings.thumbnailSize}
                            dimThumbnails={settings.dimThumbnails}
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
        </Layout>
    );
};

export default ViewList;
