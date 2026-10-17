import { categoryRouteTree } from "../category/_routeTree";
import { authRouteTree } from "../auth/_routeTree";
import { aboutRouteTree } from "../about/_routeTree";
import { settingsRouteTree } from "../settings/_routeTree";
import { searchRouteTree } from "../search/_routeTree";
import { statsRouteTree } from "../stats/_routeTree";
import { categoriesRouteTree } from "../categories/_routeTree";
import { randomRouteTree } from "../random/_routeTree";
import { peopleRouteTree } from "../people/_routeTree";
import { placesRoute } from "../places/_routeTree";
import { feedRouteTrees } from "../_media/feed/_routeTree";
import { catchAllRoute } from "../redirect/_routeTree";
import { rootRoute } from "./rootRoute";

/*
   Every area, each declared in its own _routeTree.tsx. Order does not decide
   which route an address reaches - TanStack ranks them by how specific their
   paths are - except that the catch-all goes last, for whoever reads it.

   Apart from the router, and from the application, so a test can build a
   router over the real routes without the shell coming with them.

   A route's `.to`, `.id` and `.fullPath` are filled in only when a router is
   built over this tree; before then they are undefined, and nothing says so -
   the types still claim the path. So read them where a router already exists:
   inside components, event handlers, link builders and route guards. Never at
   the top level of a module, and never above the router - AuthContext keeps
   its own strings, and `getRouteApi`, called as a module loads, keeps its
   literal.
*/
export const routeTree = rootRoute.addChildren([
    authRouteTree,
    aboutRouteTree,
    settingsRouteTree,
    searchRouteTree,
    statsRouteTree,
    categoriesRouteTree,
    randomRouteTree,
    peopleRouteTree,
    placesRoute,
    ...feedRouteTrees,
    categoryRouteTree,
    catchAllRoute
]);
