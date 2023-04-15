import { Component, For, Suspense } from "solid-js";

import { authGuard } from '../auth/auth';
import { useCategoryGridViewSettings } from '../contexts/CategoryGridViewSettingsContext';
import { useCategory } from '../contexts/CategoryContext';

import ContentLayout from '../components/layout/ContentLayout';
import MainContent from '../components/layout/MainContent';
import Toolbar from "./Toolbar";
import GridToolbar from './ToolbarGrid';
import YearGrid from './components/YearGrid';
import CategoryFilterBar from './components/CategoryFilterBar';
import { useCategoryFilterSettings } from '../contexts/CategoryFilterSettingsContext';

const GridView: Component = () => {
    authGuard();

    const [categoryState, { getCategoriesForYearAndTypeFilter, getAllYears }] = useCategory();
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

                    <For each={getAllYears()}>{ year =>
                        <YearGrid year={year} categories={getCategoriesForYearAndTypeFilter(year, filter.typeFilter)}/>
                    }</For>
                </MainContent>
            </Suspense>
        </ContentLayout>
    );
};

export default GridView;
