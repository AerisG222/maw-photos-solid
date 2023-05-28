import { Component, Resource, createEffect, createResource, createSignal } from "solid-js";
import { useRoutes } from "@solidjs/router";

import { appRoutes } from "./routes";
import { useAppSettingsContext } from './contexts/AppSettingsContext';
import { isLoggedIn } from './auth/auth';
import { getPhotoCategories } from './api/PhotoCategories';
import { getVideoCategories } from './api/VideoCategories';
import { useCategoryContext } from './contexts/CategoryContext';

import PrimaryNav from "./components/primary-nav/PrimaryNav";
import { ApiCollection } from './models/api/ApiCollection';
import { PhotoCategory } from './models/api/PhotoCategory';
import { VideoCategory } from './models/api/VideoCategory';

const App: Component = () => {
    const Routes = useRoutes(appRoutes);
    const [appSettings] = useAppSettingsContext();
    const [categoryState, { setPhotoCategories, setVideoCategories }] = useCategoryContext();
    const [isInitialized, setIsInitialized] = createSignal(false);

    let photoCategories: Resource<ApiCollection<PhotoCategory>> = undefined;
    let videoCategories: Resource<ApiCollection<VideoCategory>> = undefined;

    createEffect(() => {
        if(isLoggedIn() && !isInitialized()) {
            setIsInitialized(true);

            const [p] = createResource(getPhotoCategories);
            const [v] = createResource(getVideoCategories);

            photoCategories = p;
            videoCategories = v;
        }
    });

    createEffect(() => {
        if(photoCategories && !photoCategories.loading) {
            setPhotoCategories(photoCategories().items);
        }

        if(videoCategories && !videoCategories.loading) {
            setVideoCategories(videoCategories().items);
        }
    })

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
