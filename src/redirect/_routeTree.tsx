import { createRoute, redirect } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { categoriesRoute } from "../categories/_routeTree";
import { loginRoute } from "../auth/_routeTree";

/*
   Any address the application does not know: the categories for somebody
   signed in, the sign-in page for anybody else.

   Decided in `beforeLoad`, so nothing renders on the way through. This was a
   component that mounted and then navigated, which drew a blank page, pushed a
   history entry, and started a second navigation from inside the first.
*/
export const catchAllRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "$",
    beforeLoad: ({ context }) => {
        throw context.isLoggedIn()
            ? redirect({ to: categoriesRoute.to, replace: true })
            : redirect({ to: loginRoute.to, replace: true });
    }
});
