import { Component, createEffect, createSignal, For } from "solid-js";

import { useSearchGridViewSettingsContext } from "../_contexts/settings/SearchGridViewSettingsContext";
import { useSearchContext } from "./contexts/SearchContext";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import Toolbar from "./Toolbar";
import GridToolbar from "./ToolbarGrid";
import Layout from "../_components/layout/Layout";
import SearchBar from "./components/SearchBar";
import CategoryCard from "../_components/categories/CategoryCard";
import SearchResultStatus from "./components/SearchResultStatus";

const ViewGrid: Component = () => {
    const [settings] = useSearchGridViewSettingsContext();
    const [state, { categorySearchQuery, allSearchResults }] = useSearchContext();
    const [searchQuery, setSearchQuery] = createSignal(categorySearchQuery(state.activeTerm));

    createEffect(() => {
        setSearchQuery(categorySearchQuery(state.activeTerm));
    });

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

            <div class="flex gap-2 flex-wrap place-content-center my-4">
                <For each={allSearchResults(searchQuery()) ?? []}>
                    {(category, idx) => (
                        <CategoryCard
                            category={category}
                            showTitles={settings.showTitles}
                            thumbnailSize={settings.thumbnailSize}
                            dimThumbnails={settings.dimThumbnails}
                            showYears={settings.showYears}
                            eager={idx() <= EAGER_THRESHOLD}
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

export default ViewGrid;
