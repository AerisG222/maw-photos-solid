import { Component, For } from "solid-js";

import { useSearchGridViewSettingsContext } from "../contexts/settings/SearchGridViewSettingsContext";
import { useSearchContext } from "./contexts/SearchContext";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import Toolbar from "./Toolbar";
import GridToolbar from "./ToolbarGrid";
import Layout from "../components/layout/Layout";
import SearchBar from "./components/SearchBar";
import CategoryCard from "../components/categories/CategoryCard";
import SearchResultStatus from "./components/SearchResultStatus";

const ViewGrid: Component = () => {
    const [settings] = useSearchGridViewSettingsContext();
    const [searchContext] = useSearchContext();

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
                <For each={searchContext.categories}>
                    {(category, idx) => (
                        <CategoryCard
                            category={category}
                            showTitles={settings.showTitles}
                            thumbnailSize={settings.thumbnailSize}
                            showYears={settings.showYears}
                            eager={idx() <= EAGER_THRESHOLD}
                        />
                    )}
                </For>
            </div>

            <SearchResultStatus />
        </Layout>
    );
};

export default ViewGrid;
