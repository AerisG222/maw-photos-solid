import { Component, For, Suspense, createEffect } from "solid-js";

import { authGuard } from '../auth/auth';
import { getPhotoCategories } from '../api/api';
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

    const [categoryState, { setPhotoCategories, getCategoriesForYear, getAllYears }] = useCategory();
    const [settings] = useCategoryGridViewSettings();

    const photoCategoriesQuery = getPhotoCategories();

    createEffect(() => {
        console.log('a');

        if(photoCategoriesQuery.isSuccess) {
            console.log('b');
            setPhotoCategories(photoCategoriesQuery.data.items);
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
                        <YearGrid year={year} categories={getCategoriesForYear(year)}/>
                    }</For>
                </MainContent>
            </Suspense>
        </ContentLayout>
    );
};

export default GridView;
