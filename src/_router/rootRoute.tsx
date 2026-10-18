import { QueryClient } from "@tanstack/solid-query";
import { createRootRouteWithContext, redirect } from "@tanstack/solid-router";

import {
    GetToken,
    accountStatusQueryOptions,
    scalesQueryOptions
} from "../_contexts/api/_configQueries";

/*
   What a route's loader and guards are handed. Both live above the router -
   see index.tsx - so they exist before any screen does, which is the point:
   a loader can start a screen's queries, and a guard can turn somebody away,
   before that screen's code has even arrived.
*/
export interface RouterContext {
    queryClient: QueryClient;
    getToken: GetToken;
    isLoggedIn: () => boolean;
    // off to Auth0's sign-in page, coming back to `returnUrl`
    login: (returnUrl?: string) => Promise<void>;
}

const INACTIVE_PATH = "/auth/inactive";

/*
   The root of every route, and deliberately nothing else - in particular, not
   the application shell it renders. That is attached in router.tsx.

   Every area's routes hang from this, and components link to those routes by
   their own `.to`; if this imported the shell, a component importing a route
   would import the shell that imports the component. Kept free of the
   application, every route module is a leaf: guards, search validation and
   lazily loaded pages, nothing that can lead back.
*/
export const rootRoute = createRootRouteWithContext<RouterContext>()({
    /*
       What every screen needs before it can draw: the image sizes, and whether
       the account has been given anything yet.

       A loader rather than a guard, so this runs alongside the screen's own
       loader instead of ahead of it. As a `beforeLoad` it held every route
       below it until the account status had come back - and the sizes were
       only asked for once the shell had rendered, so a first load waited on
       three round trips in a row before the page's own data was even
       requested. Now all of them go out together.

       An account that exists but has been given nothing yet sees only the page
       saying so. The status is the same cached query the rest of the
       application reads, so after the first navigation this costs nothing.
    */
    loader: async ({ context, location }) => {
        if (!context.isLoggedIn()) {
            return;
        }

        void context.queryClient.prefetchQuery(scalesQueryOptions(context.getToken));

        if (location.pathname === INACTIVE_PATH) {
            return;
        }

        const status = await context.queryClient
            .ensureQueryData(accountStatusQueryOptions(context.getToken))
            .catch(() => undefined);

        if (status?.status === "inactive") {
            throw redirect({ to: INACTIVE_PATH });
        }
    }
});
