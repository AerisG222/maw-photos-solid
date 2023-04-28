import { Component, For, Suspense } from "solid-js";

import { useCategoryContext } from '../contexts/CategoryContext';
import { useCategoryListViewSettingsContext } from '../contexts/CategoryListViewSettingsContext';
import { useCategoryFilterSettingsContext } from '../contexts/CategoryFilterSettingsContext';

import Toolbar from "./Toolbar";
import ListToolbar from './ToolbarList';
import CategoryFilterBar from './components/CategoryFilterBar';
import YearList from './components/YearList';
import Layout from '../components/layout/Layout';

const ListView: Component = () => {
    const [categoryState, { getCategories, getYears }] = useCategoryContext();
    const [settings] = useCategoryListViewSettingsContext();
    const [filter] = useCategoryFilterSettingsContext();
    const toolbar = (
        <Toolbar>
            <ListToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} margin={settings.margin}>
            <Suspense fallback={<p>Loading...</p>}>
                <CategoryFilterBar />

                <For each={getYears(filter.yearFilter, filter.typeFilter)}>{ year =>
                    <div class="mb-4">
                        <YearList year={year} categories={getCategories(year, filter.typeFilter)} />
                    </div>
                }</For>
            </Suspense>
        </Layout>
    );
};

export default ListView;
