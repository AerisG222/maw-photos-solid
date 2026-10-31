import { createRoute, lazyRouteComponent, redirect } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { validateCategoriesSearch } from "./_search";
import { prefetch } from "../_router/prefetch";
import { loadAreaSettings } from "../_contexts/settings/_migrate";
import { equalsIgnoreCase } from "../_models/utils/StringUtils";
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
       "all". With no year yet the index is sending this on to one from the
       settings, which runs this again; there is nothing to guess at until then.
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

/*
   Opens on the view used last, and the year the address asked for - or, if it
   asked for none, the one last chosen. A `beforeLoad`, so nothing renders on the
   way through: this was a component that mounted and then navigated, with a blank
   page between.
*/
const categoriesIndexRoute = createRoute({
    getParentRoute: () => categoriesRoute,
    path: "/",
    beforeLoad: ({ search }) => {
        const area = loadAreaSettings();

        throw redirect({
            to: equalsIgnoreCase("list", area.categoriesView)
                ? categoriesListRoute.to
                : categoriesGridRoute.to,
            search: { ...search, year: search.year ?? area.categoryYearFilter },
            replace: true
        });
    }
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
