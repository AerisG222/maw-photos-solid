import { ParentComponent } from "solid-js";
import {
    AnyRoute,
    createMemoryHistory,
    createRootRoute,
    createRouter,
    RouterContextProvider,
    RouterProvider
} from "@tanstack/solid-router";

import { QueryClient } from "@tanstack/solid-query";

import { parseSearch, stringifySearch } from "./search";
import { routeTree } from "./routeTree";

/*
   For tests only.

   `WithRouter` is the application's own routes, without rendering them: what a
   component needs if all it asks of the router is where it is, or a way to go
   somewhere. The real tree rather than an empty one, because building a router
   over it is what fills in each route's `.to` - links read those, and against
   an empty tree every one would be undefined. It renders its children at once,
   so a test can look for what they drew straight away.

   Nothing loads, so the context is never asked for anything.
*/
export const WithRouter: ParentComponent<{ path?: string }> = props => {
    const router = createRouter({
        routeTree,
        context: {
            queryClient: new QueryClient(),
            getToken: () => Promise.resolve(undefined),
            isLoggedIn: () => false,
            login: () => Promise.resolve()
        },
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
