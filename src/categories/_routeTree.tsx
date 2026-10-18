import { createRoute, lazyRouteComponent } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { validateCategoriesSearch } from "./_search";
import { prefetch } from "../_router/prefetch";
import {
    categoriesForYearQueryOptions,
    yearsQueryOptions
} from "../_contexts/api/_categoryQueries";

/*
   The year-by-year listing. The year filter belongs to the whole area, so it is
   declared here, once, and both views - and the toolbar between them - read it
   from the same place.
*/
export const categoriesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "categories",
    beforeLoad: requireLogin,
    validateSearch: validateCategoriesSearch,
    /*
       The years, then the ones the address asks for - one, or every one for
       "all". With no year yet the index is about to add one from the settings,
       which runs this again; there is nothing to guess at until then.
    */
    loaderDeps: ({ search }) => ({ year: search.year }),
    loader: ({ context, deps }) =>
        prefetch(context, async (queryClient, getToken) => {
            const years = await queryClient.ensureQueryData(yearsQueryOptions(getToken));
            const wanted = deps.year === undefined ? [] : deps.year === "all" ? years : [deps.year];

            await Promise.all(
                wanted.map(year =>
                    queryClient.prefetchQuery(categoriesForYearQueryOptions(getToken, year))
                )
            );
        })
});

// opens on whichever view was used last - a setting, so decided by a component that can read it
const categoriesIndexRoute = createRoute({
    getParentRoute: () => categoriesRoute,
    path: "/",
    component: lazyRouteComponent(() => import("./Redirect"))
});

export const categoriesGridRoute = createRoute({
    getParentRoute: () => categoriesRoute,
    path: "grid",
    component: lazyRouteComponent(() => import("./Grid"))
});

export const categoriesListRoute = createRoute({
    getParentRoute: () => categoriesRoute,
    path: "list",
    component: lazyRouteComponent(() => import("./List"))
});

export const categoriesRouteTree = categoriesRoute.addChildren([
    categoriesIndexRoute,
    categoriesGridRoute,
    categoriesListRoute
]);
