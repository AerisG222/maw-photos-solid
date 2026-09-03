import { buildFeedRouteTree, placeFeedBasePath } from "../_media/feed/_routes";

/*
   The media taken at one place. The feed itself is shared with people and clans -
   see _media/feed/_routes - so all this decides is where it hangs and what it is
   called.

   It sits below the place rather than at it: /places/{id} is the drill-down into
   the states or cities inside, and /places/{id}/media is the photographs from the
   whole of it.
*/
export const placeMediaRoutes = buildFeedRouteTree(placeFeedBasePath(":placeId"), "Place");
