import { createRoute, lazyRouteComponent } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";

/*
   Signing in and out. Outside every guard, by definition: these are where a
   guard sends somebody.

   A group with no screen of its own - TanStack renders a route without a
   component as just its outlet.
*/
export const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "auth"
});

export const loginRoute = createRoute({
    getParentRoute: () => authRoute,
    path: "login",
    component: lazyRouteComponent(() => import("./Login"))
});

export const logoutRoute = createRoute({
    getParentRoute: () => authRoute,
    path: "logout",
    component: lazyRouteComponent(() => import("./Logout"))
});

export const inactiveRoute = createRoute({
    getParentRoute: () => authRoute,
    path: "inactive",
    component: lazyRouteComponent(() => import("./Inactive"))
});

export const authRouteTree = authRoute.addChildren([loginRoute, logoutRoute, inactiveRoute]);

/*
   The same two addresses as plain strings, for the one reader outside the
   router: AuthContext, which sits above it and hands them to Auth0 as where to
   come back to.
*/
export const LOGIN_PATH = "/auth/login";
export const LOGOUT_PATH = "/auth/logout";
