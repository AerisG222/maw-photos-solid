import { lazy } from "solid-js";

import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaAppRouteDefinition } from "../../_models/MediaAppRouteDefinition";
import { MediaViewDetail, MediaViewFullscreen, MediaViewGrid } from "../../_models/MediaView";

/*
   The routes behind a face driven feed: the media one person appears in, or the
   media anyone in a clan appears in.

   The two differ only in the path they hang from and the query they read, so
   they share one set of pages rather than one set each. Everything else - the
   favorites filter, the seeded shuffle, paging, the slideshow - is identical by
   construction instead of by maintenance.
*/

// media in these feeds spans categories, so an item is addressed the way the
// random feed addresses one rather than by slug alone
const mediaParams = "/:categoryYear?/:categorySlug?/:mediaSlug?";

// module level, so rebuilding the definitions for another subject does not
// create a second lazy wrapper around the same chunk
const redirectComponent = lazy(() => import("./Redirect"));
const gridComponent = lazy(() => import("./Grid"));
const detailComponent = lazy(() => import("./Detail"));
const fullscreenComponent = lazy(() => import("./Fullscreen"));
const rootComponent = lazy(() => import("../MediaRoot"));

/*
   One source of truth for where each feed lives. The route definitions register
   these with the parameter name in place; the running feed builds the same paths
   with a real id, and nothing else needs to know the shape.

   Clans sit under /people rather than at the root so the People nav entry stays
   lit while browsing one - a clan is a way into the same library, not a separate
   place.
*/
export const personFeedBasePath = (personId: string) => `/people/${personId}`;
export const clanFeedBasePath = (clanId: string) => `/people/clans/${clanId}`;

const mediaSlugOrBlank = (media: Media | undefined) =>
    media ? `/${media.categoryYear}/${media.categorySlug}/${media.slug}` : "";

export const stripMediaParams = (path: string) =>
    path.replace("/:categoryYear?", "").replace("/:categorySlug?", "").replace("/:mediaSlug?", "");

export interface FeedRoutes {
    grid: MediaAppRouteDefinition;
    detail: MediaAppRouteDefinition;
    fullscreen: MediaAppRouteDefinition;
}

/*
   Built per subject rather than declared once. The shared toolbar navigates by
   asking a route to build a path, and that path has to name the person or clan
   on screen - which the router only knows as a parameter.

   `search` is baked in for the same reason: the favorites filter and shuffle
   seed live in the query string, and a view link built without them would
   silently drop the filter the user is browsing under.
*/
export const buildFeedRoutes = (basePath: string, search = ""): FeedRoutes => ({
    grid: {
        icon: "icon-[ic--outline-apps]",
        name: "Grid",
        tooltip: "Grid View",
        mediaView: MediaViewGrid,
        shortcutKeys: ["g"],
        path: `/grid${mediaParams}`,
        absolutePath: `${basePath}/grid${mediaParams}`,
        component: gridComponent,
        buildPathForMedia: (_category: Category | undefined, media: Media | undefined) =>
            `${basePath}/grid${mediaSlugOrBlank(media)}${search}`
    },
    detail: {
        icon: "icon-[ic--round-dashboard]",
        name: "Detail",
        tooltip: "Detail View",
        mediaView: MediaViewDetail,
        shortcutKeys: ["w"],
        path: `/detail${mediaParams}`,
        absolutePath: `${basePath}/detail${mediaParams}`,
        component: detailComponent,
        buildPathForMedia: (_category: Category | undefined, media: Media | undefined) =>
            `${basePath}/detail${mediaSlugOrBlank(media)}${search}`
    },
    fullscreen: {
        icon: "icon-[ic--round-fullscreen]",
        name: "Fullscreen",
        tooltip: "Fullscreen View",
        mediaView: MediaViewFullscreen,
        shortcutKeys: ["f"],
        path: `/fullscreen${mediaParams}`,
        absolutePath: `${basePath}/fullscreen${mediaParams}`,
        component: fullscreenComponent,
        buildPathForMedia: (_category: Category | undefined, media: Media | undefined) =>
            `${basePath}/fullscreen${mediaSlugOrBlank(media)}${search}`
    }
});

// the tree handed to the router, one per subject kind
export const buildFeedRouteTree = (basePath: string, name: string): AppRouteDefinition => {
    const routes = buildFeedRoutes(basePath);

    const redirect: AppRouteDefinition = {
        path: "/",
        absolutePath: basePath,
        name: "Redirect",
        component: redirectComponent
    };

    return {
        path: basePath,
        absolutePath: basePath,
        name,
        component: rootComponent,
        children: [redirect, routes.grid, routes.detail, routes.fullscreen]
    };
};
