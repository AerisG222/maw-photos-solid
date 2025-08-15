import { Component, For } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../_contexts/settings/CategoryGridViewSettingsContext";
import { useCategoryContext } from "../_contexts/CategoryContext";

import Toolbar from "./Toolbar";
import GridToolbar from "./ToolbarGrid";
import YearGrid from "./components/YearGrid";
import CategoryFilterBar from "./components/CategoryFilterBar";
import Layout from "../_components/layout/Layout";

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

            <For each={getFilteredYears()}>
                {(year, idx) => (
                    <YearGrid
                        year={year}
                        categories={getFilteredCategoriesForYear(year)}
                        enableEagerLoading={idx() === 0}
                    />
                )}
            </For>
        </Layout>
    );
};

export default GridView;
