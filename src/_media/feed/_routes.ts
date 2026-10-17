import { linkOptions } from "@tanstack/solid-router";

import { Media } from "../../_models/Media";
import { MediaView, MediaViewGrid } from "../../_models/MediaView";
import { MediaViewRoute } from "../../_models/MediaViewRoute";
import { RouteDisplay } from "../../_models/RouteDisplay";
import { Uuid } from "../../_models/Uuid";
import { FeedSearch } from "./_search";
import {
    clanFeedCategoriesRoute,
    clanFeedGridRoute,
    clanFeedRoute,
    personFeedCategoriesRoute,
    personFeedGridRoute,
    personFeedRoute,
    placeFeedCategoriesRoute,
    placeFeedGridRoute,
    placeFeedRoute
} from "./_routeTree";

export type { FeedSearch } from "./_search";

/*
   A feed over a subject: the media one person appears in, the media anyone in a
   clan appears in, or the media taken at a place.

   They differ only in where they hang and which query they read, so they share
   one set of pages rather than one set each. Everything else - the favorites
   filter, the seeded shuffle, paging, the slideshow - is identical by
   construction instead of by maintenance. The routes are in _routeTree.tsx.
*/
export type FeedSubject =
    { kind: "person"; id: Uuid } | { kind: "clan"; id: Uuid } | { kind: "place"; id: Uuid };

export const gridView: MediaViewRoute = {
    icon: "icon-[ic--round-apps]",
    name: "Grid",
    tooltip: "Grid View",
    mediaView: MediaViewGrid
};

export const feedMediaDisplay: RouteDisplay = {
    icon: "icon-[ic--round-image]",
    name: "Media",
    tooltip: "Show Media"
};

/*
   A listing of the categories the subject turns up in, rather than of their
   media. Its own route rather than a flag on the grid: it lists a different
   thing, so it has a different toolbar and a different query, and neither has
   to ask which mode it is in.
*/
export const feedCategoriesDisplay: RouteDisplay = {
    icon: "icon-[ic--round-collections]",
    name: "Categories",
    tooltip: "Show Categories"
};

/*
   Which media listing a feed can open on. There is one: map and bulk edit
   belong to a single category, and fullscreen stopped being a view at all - it
   is a toggle on the grid now - so every saved preference resolves here. Kept
   as a function because the caller asks a question that may have more than one
   answer again.
*/
export const feedMediaListing = (_view: MediaView) => MediaViewGrid;

// media in a feed spans categories, so a photo is addressed by its category as well as its slug
// left out entirely, rather than present and undefined, when there is no photo
const mediaParams = (media: Media | undefined): Record<string, string> =>
    media
        ? {
              categoryYear: String(media.categoryYear),
              categorySlug: media.categorySlug,
              mediaSlug: media.slug
          }
        : {};

/*
   A feed's grid, optionally open on one photo, under the filter it is being
   browsed with - typed per subject, so a person's feed cannot be handed a
   clan's address. The filter rides along because a link built without it would
   silently drop what the reader is browsing under.
*/
export const feedGridLink = (subject: FeedSubject, media?: Media, search: FeedSearch = {}) => {
    switch (subject.kind) {
        case "clan":
            return linkOptions({
                to: clanFeedGridRoute.to,
                params: { clanId: subject.id, ...mediaParams(media) },
                search
            });
        case "place":
            return linkOptions({
                to: placeFeedGridRoute.to,
                params: { placeId: subject.id, ...mediaParams(media) },
                search
            });
        default:
            return linkOptions({
                to: personFeedGridRoute.to,
                params: { personId: subject.id, ...mediaParams(media) },
                search
            });
    }
};

/*
   A feed's categories. Only the favorites filter carries across: a seeded
   shuffle has no meaning for a list of categories, and the API takes no seed
   for them.
*/
export const feedCategoriesLink = (subject: FeedSubject, favoritesOnly: boolean) => {
    const search = favoritesOnly ? { f: true } : {};

    switch (subject.kind) {
        case "clan":
            return linkOptions({
                to: clanFeedCategoriesRoute.to,
                params: { clanId: subject.id },
                search
            });
        case "place":
            return linkOptions({
                to: placeFeedCategoriesRoute.to,
                params: { placeId: subject.id },
                search
            });
        default:
            return linkOptions({
                to: personFeedCategoriesRoute.to,
                params: { personId: subject.id },
                search
            });
    }
};

// a feed itself, which opens on whichever listing was used last
export const feedLink = (subject: FeedSubject) => {
    switch (subject.kind) {
        case "clan":
            return linkOptions({ to: clanFeedRoute.to, params: { clanId: subject.id } });
        case "place":
            return linkOptions({ to: placeFeedRoute.to, params: { placeId: subject.id } });
        default:
            return linkOptions({ to: personFeedRoute.to, params: { personId: subject.id } });
    }
};
