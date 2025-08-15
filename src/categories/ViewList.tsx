import { Component, For } from "solid-js";

import { useCategoryContext } from "../_contexts/CategoryContext";
import { useCategoryListViewSettingsContext } from "../_contexts/settings/CategoryListViewSettingsContext";

import Toolbar from "./Toolbar";
import ListToolbar from "./ToolbarList";
import CategoryFilterBar from "./components/CategoryFilterBar";
import YearList from "./components/YearList";
import Layout from "../_components/layout/Layout";

const ListView: Component = () => {
    const [, { getFilteredYears, getFilteredCategoriesForYear }] = useCategoryContext();
    const [settings] = useCategoryListViewSettingsContext();

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

            <For each={getFilteredYears()}>
                {(year, idx) => (
                    <YearList
                        year={year}
                        categories={getFilteredCategoriesForYear(year)}
                        enableEagerLoading={idx() === 0}
                    />
                )}
            </For>
        </Layout>
    );
};

export default ListView;
