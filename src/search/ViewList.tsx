import { Component, For } from "solid-js";

import { useSearchListViewSettingsContext } from "../contexts/settings/SearchListViewSettingsContext";
import { useSearchContext } from "./contexts/SearchContext";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import Toolbar from "./Toolbar";
import ListToolbar from "./ToolbarList";
import Layout from "../components/layout/Layout";
import SearchBar from "./components/SearchBar";
import CategoryListItem from "../components/categories/CategoryListItem";
import SearchResultStatus from "./components/SearchResultStatus";

const ViewList: Component = () => {
    const [settings] = useSearchListViewSettingsContext();
    const [searchContext] = useSearchContext();

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
                <For each={searchContext.categories}>
                    {(category, idx) => (
                        <CategoryListItem
                            category={category}
                            showYear={true}
                            thumbnailSize={settings.thumbnailSize}
                            eager={idx() <= EAGER_THRESHOLD}
                        />
                    )}
                </For>
            </div>

            <SearchResultStatus />
        </Layout>
    );
};

export default ViewList;
