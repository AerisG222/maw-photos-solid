import { buildFeedRouteTree, clanFeedBasePath } from "../_media/feed/_routes";
import { Uuid } from "../_models/Uuid";

/*
   The media anyone in a clan appears in. Identical to the person feed in every
   respect the user can see - the same views, filters, shuffle and slideshow -
   because it is the same feed pointed at a different subject.
*/
export const getClanPath = (clanId: Uuid) => clanFeedBasePath(clanId);

export const clanMediaRoutes = buildFeedRouteTree(clanFeedBasePath(":clanId"), "Clan");
