import { Component, For, Suspense } from "solid-js";

import { authGuard } from '../auth/auth';
import { useCategoryFilterSettings } from '../contexts/CategoryFilterSettingsContext';
import { useCategoryGridViewSettings } from '../contexts/CategoryGridViewSettingsContext';
import { useCategory } from '../contexts/CategoryContext';

import ContentLayout from '../components/layout/ContentLayout';
import MainContent from '../components/layout/MainContent';
import Toolbar from "./Toolbar";
import GridToolbar from './ToolbarGrid';
import YearGrid from './components/YearGrid';
import CategoryFilterBar from './components/CategoryFilterBar';

const GridView: Component = () => {
    authGuard();

    const [categoryState, { getCategories, getYears }] = useCategory();
    const [settings] = useCategoryGridViewSettings();
    const [filter] = useCategoryFilterSettings();

    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <Suspense fallback={<p>Loading...</p>}>
                <MainContent margin={settings.margin}>
                    <CategoryFilterBar />

                    <For each={getYears(filter.yearFilter, filter.typeFilter)}>{ year =>
                        <YearGrid year={year} categories={getCategories(year, filter.typeFilter)}/>
                    }</For>
                </MainContent>
            </Suspense>
        </ContentLayout>
    );
};

export default GridView;
