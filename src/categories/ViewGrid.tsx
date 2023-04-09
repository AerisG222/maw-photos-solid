import { Component, Suspense } from "solid-js";

import { authGuard } from '../auth/auth';
import { getPhotoCategories } from '../api/api';

import ContentLayout from '../components/layout/ContentLayout';
import MainContent from '../components/layout/MainContent';
import Toolbar from "./Toolbar";
import GridToolbar from './ToolbarGrid';

const GridView: Component = () => {
    authGuard();

    const photoCategoriesQuery = getPhotoCategories();

    const photoCategories = () => photoCategoriesQuery?.data;
    const photoCategoriesCount = () => { return photoCategories()?.count };
    const photoCategoryYears = () => [...new Set(photoCategories()?.items?.map(x => x.year))];

    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <Suspense fallback={<p>Loading...</p>}>
                <MainContent title="Categories - Grid">
                    {photoCategoriesCount()}
                    {photoCategoryYears()}
                    <p>Here is a variable: {import.meta.env.VITE_AUTH_CLIENT_ID}</p>
                </MainContent>
            </Suspense>
        </ContentLayout>
    );
};

export default GridView;
