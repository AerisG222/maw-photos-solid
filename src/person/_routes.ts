import { buildFeedRouteTree, personFeedBasePath } from "../_media/feed/_routes";

/*
   One person's media. The feed itself is shared with clans - see
   _media/feed/_routes - so all this decides is where it hangs and what it is
   called.
*/
export const personMediaRoutes = buildFeedRouteTree(personFeedBasePath(":personId"), "Person");
