import { lazy } from "solid-js";

import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { Category } from "../_models/Category";
import { Media } from "../_models/Media";
import { MediaAppRouteDefinition } from "../_models/MediaAppRouteDefinition";
import { MediaViewDetail, MediaViewFullscreen, MediaViewGrid } from "../_models/MediaView";

const basePath = "/people/:personId";

/*
   A person's media spans categories, so an item is addressed the way the random
   feed addresses one - year and category slug alongside the media slug - rather
   than by slug alone as within a single category.
*/
const mediaParams = "/:categoryYear?/:categorySlug?/:mediaSlug?";

// module level so rebuilding the definitions for another person does not create
// a second lazy wrapper around the same chunk
const redirectComponent = lazy(() => import("./Redirect"));
const gridComponent = lazy(() => import("./Grid"));
const detailComponent = lazy(() => import("./Detail"));
const fullscreenComponent = lazy(() => import("./Fullscreen"));

const mediaSlugOrBlank = (media: Media | undefined) =>
    media ? `/${media.categoryYear}/${media.categorySlug}/${media.slug}` : "";

export const stripMediaParams = (path: string) =>
    path.replace("/:categoryYear?", "").replace("/:categorySlug?", "").replace("/:mediaSlug?", "");

/*
   Built per person rather than declared once. The toolbar navigates by asking a
   route to build a path, and that path has to name the person whose media is on
   screen - which the router only knows as a parameter. Passing the literal
   ":personId" yields the definitions the router is registered with; passing a
   real id yields the ones the media service navigates by.
*/
const buildRoutes = (personId: string) => {
    const base = `/people/${personId}`;

    const grid: MediaAppRouteDefinition = {
        icon: "icon-[ic--outline-apps]",
        name: "Grid",
        tooltip: "Grid View",
        mediaView: MediaViewGrid,
        shortcutKeys: ["g"],
        path: `/grid${mediaParams}`,
        absolutePath: `${base}/grid${mediaParams}`,
        component: gridComponent,
        buildPathForMedia: (_category: Category | undefined, media: Media | undefined) =>
            `${base}/grid${mediaSlugOrBlank(media)}`
    };

    const detail: MediaAppRouteDefinition = {
        icon: "icon-[ic--round-dashboard]",
        name: "Detail",
        tooltip: "Detail View",
        mediaView: MediaViewDetail,
        shortcutKeys: ["w"],
        path: `/detail${mediaParams}`,
        absolutePath: `${base}/detail${mediaParams}`,
        component: detailComponent,
        buildPathForMedia: (_category: Category | undefined, media: Media | undefined) =>
            `${base}/detail${mediaSlugOrBlank(media)}`
    };

    const fullscreen: MediaAppRouteDefinition = {
        icon: "icon-[ic--round-fullscreen]",
        name: "Fullscreen",
        tooltip: "Fullscreen View",
        mediaView: MediaViewFullscreen,
        shortcutKeys: ["f"],
        path: `/fullscreen${mediaParams}`,
        absolutePath: `${base}/fullscreen${mediaParams}`,
        component: fullscreenComponent,
        buildPathForMedia: (_category: Category | undefined, media: Media | undefined) =>
            `${base}/fullscreen${mediaSlugOrBlank(media)}`
    };

    return { grid, detail, fullscreen };
};

export const getPersonMediaRoutes = (personId: string) => buildRoutes(personId);

const routes = buildRoutes(":personId");

const redirectRoute: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    name: "Redirect",
    component: redirectComponent
};

export const personMediaRoutes: AppRouteDefinition = {
    path: basePath,
    absolutePath: basePath,
    name: "Person",
    component: lazy(() => import("../_media/MediaRoot")),
    children: [redirectRoute, routes.grid, routes.detail, routes.fullscreen]
};
