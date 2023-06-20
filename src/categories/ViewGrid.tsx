import { Component, For, Suspense } from "solid-js";

import { useCategoryFilterSettingsContext } from '../contexts/settings/CategoryFilterSettingsContext';
import { useCategoryGridViewSettingsContext } from '../contexts/settings/CategoryGridViewSettingsContext';
import { useCategoryContext } from '../contexts/CategoryContext';

import Toolbar from "./Toolbar";
import GridToolbar from './ToolbarGrid';
import YearGrid from './components/YearGrid';
import CategoryFilterBar from './components/CategoryFilterBar';
import Layout from '../components/layout/Layout';

const GridView: Component = () => {
    const [categoryState, { getCategories, getYears }] = useCategoryContext();
    const [settings] = useCategoryGridViewSettingsContext();
    const [filter] = useCategoryFilterSettingsContext();
    const toolbar = (
        <Toolbar>
            <GridToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} margin={settings.margin}>
            <Suspense fallback={<p>Loading...</p>}>
                <CategoryFilterBar />

                <For each={getYears(filter.yearFilter, filter.typeFilter)}>{ year =>
                    <YearGrid year={year} categories={getCategories(year, filter.typeFilter)}/>
                }</For>
            </Suspense>
        </Layout>
    );
};

export default GridView;
