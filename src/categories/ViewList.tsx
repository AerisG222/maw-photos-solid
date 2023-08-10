import { Component, For } from "solid-js";

import { useCategoryContext } from "../contexts/CategoryContext";
import { useCategoryListViewSettingsContext } from "../contexts/settings/CategoryListViewSettingsContext";

import Toolbar from "./Toolbar";
import ListToolbar from "./ToolbarList";
import CategoryFilterBar from "./components/CategoryFilterBar";
import YearList from "./components/YearList";
import Layout from "../components/layout/Layout";

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

            <For each={getFilteredYears()}>{ year =>
                <YearList year={year} categories={getFilteredCategoriesForYear(year)}/>
            }</For>
        </Layout>
    );
};

export default ListView;
