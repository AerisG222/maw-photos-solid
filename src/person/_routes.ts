import { buildFeedRouteTree, buildFeedRoutes, personFeedBasePath } from "../_media/feed/_routes";
import { Uuid } from "../_models/Uuid";

/*
   One person's media. The feed itself is shared with clans - see
   _media/feed/_routes - so all this decides is where it hangs and what it is
   called.
*/
const basePath = personFeedBasePath(":personId");

export const getPersonMediaRoutes = (personId: Uuid, search = "") =>
    buildFeedRoutes(personFeedBasePath(personId), search);

export const personMediaRoutes = buildFeedRouteTree(basePath, "Person");
