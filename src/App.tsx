import { Component, createEffect } from "solid-js";
import { useRoutes } from "@solidjs/router";
import { CreateQueryResult } from '@tanstack/solid-query';

import { appRoutes } from "./routes";
import { useAppSettingsContext } from './contexts/AppSettingsContext';
import { isLoggedIn } from './auth/auth';
import { getPhotoCategories } from './api/PhotoCategories';
import { getVideoCategories } from './api/VideoCategories';
import { ApiCollection } from './models/api/ApiCollection';
import { PhotoCategory } from './models/api/PhotoCategory';
import { VideoCategory } from './models/api/VideoCategory';
import { useCategoryContext } from './contexts/CategoryContext';

import PrimaryNav from "./components/primary-nav/PrimaryNav";

const App: Component = () => {
    const Routes = useRoutes(appRoutes);
    const [appSettings] = useAppSettingsContext();
    const [categoryState, { setPhotoCategories, setVideoCategories }] = useCategoryContext();

    let photoCategoriesQuery: CreateQueryResult<ApiCollection<PhotoCategory>> = undefined;
    let videoCategoriesQuery: CreateQueryResult<ApiCollection<VideoCategory>> = undefined;

    createEffect(() => {
        if(isLoggedIn()) {
            photoCategoriesQuery = getPhotoCategories();
            videoCategoriesQuery = getVideoCategories();

            if(photoCategoriesQuery.isSuccess) {
                setPhotoCategories(photoCategoriesQuery.data.items);
            }

            if(videoCategoriesQuery.isSuccess) {
                setVideoCategories(videoCategoriesQuery.data.items);
            }
        }
    });

    return (
        <div data-theme={appSettings.theme}
             class="grid
                  grid-rows-[max-content_auto] grid-cols-[100vw]
                  md:grid-rows-[100vh] md:grid-cols-[max-content_auto]">
            <PrimaryNav />
            <Routes />
        </div>
    );
};

export default App;
