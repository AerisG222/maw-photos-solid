import { QueryClient } from "@tanstack/solid-query";
import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/solid-router";

import { GetToken, accountStatusQueryOptions } from "../_contexts/api/_routeQueries";

import AppContext from "../_components/app-context/AppContext";
import App from "../App";

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

export const rootRoute = createRootRouteWithContext<RouterContext>()({
    /*
       An account that exists but has been given nothing yet sees only the page
       saying so. This was AccountActivatedGuard, which rendered whatever was
       asked for and then moved away once the account status arrived - so the
       screen showed, and its queries were refused, before the redirect.

       The status is the same cached query the rest of the application reads,
       so after the first navigation this costs nothing.
    */
    beforeLoad: async ({ context, location }) => {
        if (!context.isLoggedIn() || location.pathname === INACTIVE_PATH) {
            return;
        }

        const status = await context.queryClient
            .ensureQueryData(accountStatusQueryOptions(context.getToken))
            .catch(() => undefined);

        if (status?.status === "inactive") {
            throw redirect({ to: INACTIVE_PATH });
        }
    },
    component: () => (
        <AppContext>
            <App>
                <Outlet />
            </App>
        </AppContext>
    )
});
