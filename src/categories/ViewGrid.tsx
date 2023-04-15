import { Component, For, Suspense, createEffect } from "solid-js";

import { authGuard } from '../auth/auth';
import { getPhotoCategories, getVideoCategories } from '../api/api';
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

    const [categoryState, { setPhotoCategories, setVideoCategories, getCategoriesForYearAndTypeFilter, getAllYears }] = useCategory();
    const [settings] = useCategoryGridViewSettings();
    const [filter] = useCategoryFilterSettings();

    const photoCategoriesQuery = getPhotoCategories();
    const videoCategoriesQuery = getVideoCategories();

    createEffect(() => {
        if(photoCategoriesQuery.isSuccess) {
            setPhotoCategories(photoCategoriesQuery.data.items);
        }

        if(videoCategoriesQuery.isSuccess) {
            setVideoCategories(videoCategoriesQuery.data.items);
        }
    })

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
