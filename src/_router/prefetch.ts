import { QueryClient } from "@tanstack/solid-query";

import { GetToken } from "../_contexts/api/_configQueries";
import { RouterContext } from "./rootRoute";

/*
   Start a screen's queries from its route's loader, and do not wait for them.

   A loader runs as soon as the route is matched - or merely hovered or
   focused, with intent preloading - and alongside the download of the page's
   code, where the page's own queries would otherwise start only once that code
   had arrived and mounted. The page still asks for the same queries, through
   the same definitions, and renders its own loading state exactly as before;
   this only means the answers are already on their way. Holding navigation
   until they land would trade a skeleton for a frozen click.

   Nothing for somebody signed out - the guard is sending them to sign in - and
   a failure is left to the page, which asks again and shows the error itself.
*/
export const prefetch = (
    context: RouterContext,
    start: (queryClient: QueryClient, getToken: GetToken) => Promise<unknown>
) => {
    if (!context.isLoggedIn()) {
        return;
    }

    start(context.queryClient, context.getToken).catch(() => {
        // the page asks again for itself, and shows the error if there is one
    });
};
