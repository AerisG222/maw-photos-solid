import { Component, Suspense, createEffect } from "solid-js";
import { accessToken, authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";
import GridToolbar from './ToolbarGrid';
import MainContent from '../components/layout/MainContent';
import { getCategories } from '../api/api';

const GridView: Component = () => {
    authGuard();

    const categories = getCategories(accessToken());

    createEffect(() => {
        if(categories.isSuccess) {
            console.log(categories.data);
        }
    });

    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <Suspense fallback={<p>Loading...</p>}>
                <MainContent title="Categories - Grid">
                    <p>Here is a variable: {import.meta.env.VITE_AUTH_CLIENT_ID}</p>
                </MainContent>
            </Suspense>
        </ContentLayout>
    );
};

export default GridView;
