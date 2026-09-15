import { lazy } from "solid-js";

import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { Uuid } from "../_models/Uuid";
import { buildFeedRouteTree, clanFeedBasePath, personFeedBasePath } from "../_media/feed/_routes";

const basePath = "/people";

export const peopleGrid: AppRouteDefinition = {
    icon: "icon-[ic--round-apps]",
    name: "Grid",
    tooltip: "Grid View",
    path: "/",
    absolutePath: basePath,
    component: lazy(() => import("./Grid"))
};

export const people: AppRouteDefinition = {
    icon: "icon-[ic--round-people]",
    name: "People",
    helpText: "Browse photos and videos by the people that appear in them.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("./Layout")),
    children: [peopleGrid]
};

export const getPersonPath = (id: Uuid) => `${basePath}/${id}`;

export const getClanPath = (clanId: Uuid) => clanFeedBasePath(clanId);

/*
   The media one person appears in, and the media anyone in a clan appears in.

   Both hang under `/people`, and both were a top-level directory of their own
   holding a single line - `src/person` and `src/clan`, sitting beside `src/people`
   and differing from it by a letter. The path already said where they belong, and
   `getPersonPath` above was already here deciding what that path is, so the tree
   built on it may as well be too.

   Neither decides much: the feed is shared with places and defined in
   `_media/feed/_routes`, so all that is chosen here is where it hangs and what it
   is called. A clan is the same feed pointed at a different subject, identical in
   every respect a reader can see.
*/
export const personMediaRoutes = buildFeedRouteTree(personFeedBasePath(":personId"), "Person");

export const clanMediaRoutes = buildFeedRouteTree(clanFeedBasePath(":clanId"), "Clan");
