import { Component, For } from "solid-js";

import { useCategoryListViewSettingsContext } from "../_contexts/settings/CategoryListViewSettingsContext";
import { useCategoriesByYear } from './useCategoriesByYear';

import Toolbar from "./Toolbar";
import ListToolbar from "./ToolbarList";
import CategoryFilterBar from "./components/CategoryFilterBar";
import YearList from "./components/YearList";
import Layout from "../_components/layout/Layout";

const ListView: Component = () => {
    const [settings] = useCategoryListViewSettingsContext();
    const { categoriesToDisplay } = useCategoriesByYear();

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

            <For each={Object.keys(categoriesToDisplay()!).map(x => parseInt(x, 10)).sort().reverse()}>
                {(year, idx) => (
                    <YearList
                        year={year}
                        categories={categoriesToDisplay()![year] ?? []}
                        enableEagerLoading={idx() === 0}
                    />
                )}
            </For>
        </Layout>
    );
};

export default ListView;
