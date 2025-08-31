import { Component, For } from "solid-js";

import { useCategoryListViewSettingsContext } from "../_contexts/settings/CategoryListViewSettingsContext";
import { useCategoryFilterSettingsContext } from "../_contexts/settings/CategoryFilterSettingsContext";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";

import Toolbar from "./Toolbar";
import ListToolbar from "./ToolbarList";
import CategoryFilterBar from "./components/CategoryFilterBar";
import YearList from "./components/YearList";
import Layout from "../_components/layout/Layout";

const ListView: Component = () => {
    const [settings] = useCategoryListViewSettingsContext();
    const [filter] = useCategoryFilterSettingsContext();
    const { categoriesForYearQuery } = useCategoriesContext();

    const categories = categoriesForYearQuery(() => filter.yearFilter as number);

    return (
        <Layout
            toolbar={
                <Toolbar>
                    <ListToolbar />
                </Toolbar>
            }
            margin={settings.margin}
        >
            <CategoryFilterBar />

            <For each={[filter.yearFilter]}>
                {(year, idx) => (
                    <YearList
                        year={year}
                        categories={categories.data}
                        enableEagerLoading={idx() === 0}
                    />
                )}
            </For>
        </Layout>
    );
};

export default ListView;
