import { ParsedLocation } from "@tanstack/solid-router";

import { RouterContext } from "./rootRoute";

/*
   Signed in, or off to sign in - before the screen exists, rather than the
   screen rendering and then deciding. This was AuthGuard, a component each area
   wrapped its layout in; as a `beforeLoad` the area's queries never start for
   somebody who is about to leave for the sign-in page anyway.

   Sign-in is Auth0's page, so the browser is leaving. The promise that never
   settles keeps the router from rendering what it was refused in the meantime.
   The target is the address being navigated to, not the one being left - the
   address bar has not moved yet when this runs.
*/
export const requireLogin = async ({
    context,
    location
}: {
    context: RouterContext;
    location: ParsedLocation;
}) => {
    const token = context.isLoggedIn()
        ? await context.getToken().catch(() => undefined)
        : undefined;

    if (!token) {
        await context.login(location.href);

        return new Promise<never>(() => undefined);
    }
};
