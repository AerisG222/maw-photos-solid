import { Component, For, Suspense } from "solid-js";

import { useCategoryContext } from '../contexts/CategoryContext';
import { useCategoryListViewSettingsContext } from '../contexts/settings/CategoryListViewSettingsContext';

import Toolbar from "./Toolbar";
import ListToolbar from './ToolbarList';
import CategoryFilterBar from './components/CategoryFilterBar';
import YearList from './components/YearList';
import Layout from '../components/layout/Layout';

const ListView: Component = () => {
    const [, { getFilteredYears, getFilteredCategoriesForYear }] = useCategoryContext();
    const [settings] = useCategoryListViewSettingsContext();

    const toolbar = (
        <Toolbar>
            <ListToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} margin={settings.margin}>
            <Suspense fallback={<p>Loading...</p>}>
                <CategoryFilterBar />

                <For each={getFilteredYears()}>{ year =>
                    <YearList year={year} categories={getFilteredCategoriesForYear(year)}/>
                }</For>
            </Suspense>
        </Layout>
    );
};

export default ListView;
