import { ParentComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { AnyRoute, createRoute, Outlet } from "@tanstack/solid-router";

// a route as the application's _routes.ts files describe them
export interface RouteNode {
    path: string;
    component?: ParentComponent;
    children?: RouteNode[];
}

/*
   The old router's path syntax in TanStack's: `:param` is `$param`, an
   optional `:param?` is `{-$param}`, and a catch-all `*` is `$`. Children are
   relative, so the leading slash goes - except on `/` itself, which TanStack
   reads as a parent's index route.
*/
export const toTanStackPath = (path: string) => {
    if (path === "/") {
        return "/";
    }

    return path
        .replace(/^\//, "")
        .split("/")
        .map(segment => {
            if (segment.startsWith("*")) {
                return "$";
            }

            if (segment.startsWith(":")) {
                return segment.endsWith("?")
                    ? `{-$${segment.slice(1, -1)}}`
                    : `$${segment.slice(1)}`;
            }

            return segment;
        })
        .join("/");
};

/*
   The application's route definitions, as TanStack routes under `parent`.

   A layout here is a component rendering its children, where TanStack's renders
   an <Outlet />; handing it the outlet as its children joins the two, so no
   layout had to change. A route with no component of its own - a group, like
   /auth - renders its outlet, which is TanStack's default.

   Typed only as `AnyRoute`: these paths are strings decided at runtime, so
   there is nothing for the type system to check links against. That is the
   gap the typed areas close - see category/_routeTree.tsx.
*/
export const toRoutes = (parent: AnyRoute, nodes: RouteNode[]): AnyRoute[] =>
    nodes.map(node => {
        const Layout = node.component;
        const route = createRoute({
            getParentRoute: () => parent,
            path: toTanStackPath(node.path),
            component:
                Layout && node.children
                    ? () => (
                          <Dynamic component={Layout}>
                              <Outlet />
                          </Dynamic>
                      )
                    : Layout
        } as never) as AnyRoute;

        return node.children ? route.addChildren(toRoutes(route, node.children)) : route;
    });
