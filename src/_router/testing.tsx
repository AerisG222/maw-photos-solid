import { ParentComponent } from "solid-js";
import {
    AnyRoute,
    createMemoryHistory,
    createRootRoute,
    createRouter,
    RouterContextProvider,
    RouterProvider
} from "@tanstack/solid-router";

import { parseSearch, stringifySearch } from "./search";

/*
   For tests only.

   `WithRouter` is a router and no routes: what a component needs if all it
   asks of the router is where it is, or a way to go somewhere. It renders its
   children at once, so a test can look for what they drew straight away - a
   router that resolves routes first renders nothing until that has settled.
*/
export const WithRouter: ParentComponent<{ path?: string }> = props => {
    const router = createRouter({
        routeTree: createRootRoute(),
        // eslint-disable-next-line solid/reactivity -- where the test starts; read once
        history: createMemoryHistory({ initialEntries: [props.path ?? "/"] }),
        parseSearch,
        stringifySearch
    });

    return <RouterContextProvider router={router}>{() => props.children}</RouterContextProvider>;
};

/*
   Real routes on the real address bar, for a test about where something leads -
   handed the root to hang them from. They resolve asynchronously, so look for
   the result with `findBy`.
*/
export const TestRouter = (props: { routes: (root: AnyRoute) => AnyRoute[] }) => {
    const rootRoute = createRootRoute();
    const router = createRouter({
        // eslint-disable-next-line solid/reactivity -- the routes under test; read once
        routeTree: rootRoute.addChildren(props.routes(rootRoute)),
        parseSearch,
        stringifySearch
    });

    return <RouterProvider router={router} />;
};
