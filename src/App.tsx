import { Component, createEffect, createResource } from "solid-js";
import { useRoutes } from "@solidjs/router";

import { appRoutes } from "./routes";
import { useAppSettingsContext } from './contexts/AppSettingsContext';
import { isLoggedIn } from './auth/auth';
import { getPhotoCategories } from './api/PhotoCategories';
import { getVideoCategories } from './api/VideoCategories';
import { useCategoryContext } from './contexts/CategoryContext';

import PrimaryNav from "./components/primary-nav/PrimaryNav";

const App: Component = () => {
    const Routes = useRoutes(appRoutes);
    const [appSettings] = useAppSettingsContext();
    const [categoryState, { setPhotoCategories, setVideoCategories }] = useCategoryContext();

    const getPhotoCats = (isLoggedIn) => isLoggedIn ? getPhotoCategories() : null;
    const getVideoCats = (isLoggedIn) => isLoggedIn ? getVideoCategories() : null;

    const [photoCategories] = createResource(isLoggedIn, getPhotoCats);
    const [videoCategories] = createResource(isLoggedIn, getVideoCats);

    createEffect(() => {
        setPhotoCategories(photoCategories()?.items ?? []);
        setVideoCategories(videoCategories()?.items ?? []);
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
