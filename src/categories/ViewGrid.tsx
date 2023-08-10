import { Component, For } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../contexts/settings/CategoryGridViewSettingsContext";
import { useCategoryContext } from "../contexts/CategoryContext";

import Toolbar from "./Toolbar";
import GridToolbar from "./ToolbarGrid";
import YearGrid from "./components/YearGrid";
import CategoryFilterBar from "./components/CategoryFilterBar";
import Layout from "../components/layout/Layout";

const GridView: Component = () => {
    const [, { getFilteredCategoriesForYear, getFilteredYears }] = useCategoryContext();
    const [settings] = useCategoryGridViewSettingsContext();

    return (
        <Layout
            toolbar={
                <Toolbar>
                    <GridToolbar />
                </Toolbar>
            }
            margin={settings.margin}
        >
            <CategoryFilterBar />

            <For each={getFilteredYears()}>{ year =>
                <YearGrid year={year} categories={getFilteredCategoriesForYear(year)}/>
            }</For>
        </Layout>
    );
};

export default GridView;
