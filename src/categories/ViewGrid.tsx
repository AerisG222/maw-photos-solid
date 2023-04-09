import { Component, For, Suspense } from "solid-js";

import { authGuard } from '../auth/auth';
import { getPhotoCategories } from '../api/api';

import ContentLayout from '../components/layout/ContentLayout';
import MainContent from '../components/layout/MainContent';
import Toolbar from "./Toolbar";
import GridToolbar from './ToolbarGrid';
import YearGrid from './components/YearGrid';

const GridView: Component = () => {
    authGuard();

    const photoCategoriesQuery = getPhotoCategories();

    const photoCategories = () => photoCategoriesQuery?.data;
    const photoCategoriesCount = () => { return photoCategories()?.count };
    const photoCategoryYears = () => [...new Set(photoCategories()?.items?.map(x => x.year))].sort();
    const photoCategoriesForYear = (year: number) => photoCategories().items.filter(x => x.year === year).sort(x => x.id);

    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <Suspense fallback={<p>Loading...</p>}>
                <MainContent title="Categories - Grid">
                    <For each={photoCategoryYears()}>{ year =>
                        <YearGrid year={year} categories={photoCategoriesForYear(year)}/>
                    }</For>
                </MainContent>
            </Suspense>
        </ContentLayout>
    );
};

export default GridView;
