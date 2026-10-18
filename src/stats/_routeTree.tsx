import { createRoute, lazyRouteComponent, redirect } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { validateStatsSearch } from "./_search";
import { prefetch } from "../_router/prefetch";
import { statsByYearQueryOptions, statsForYearQueryOptions } from "../_contexts/api/_statsQueries";

export const statsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "stats",
    beforeLoad: requireLogin,
    component: lazyRouteComponent(() => import("./Layout"))
});

const statsIndexRoute = createRoute({
    getParentRoute: () => statsRoute,
    path: "/",
    beforeLoad: () => {
        throw redirect({ to: statsSummaryRoute.to, replace: true });
    }
});

export const statsSummaryRoute = createRoute({
    getParentRoute: () => statsRoute,
    path: "summary",
    validateSearch: validateStatsSearch("category-count"),
    loader: ({ context }) =>
        prefetch(context, (queryClient, getToken) =>
            queryClient.prefetchQuery(statsByYearQueryOptions(getToken))
        ),
    component: lazyRouteComponent(() => import("./Summary"))
});

export const statsYearRoute = createRoute({
    getParentRoute: () => statsRoute,
    path: "summary/$year",
    validateSearch: validateStatsSearch("count"),
    loader: ({ context, params }) =>
        prefetch(context, (queryClient, getToken) =>
            queryClient.prefetchQuery(statsForYearQueryOptions(getToken, parseInt(params.year, 10)))
        ),
    component: lazyRouteComponent(() => import("./Year"))
});

export const statsRouteTree = statsRoute.addChildren([
    statsIndexRoute,
    statsSummaryRoute,
    statsYearRoute
]);
