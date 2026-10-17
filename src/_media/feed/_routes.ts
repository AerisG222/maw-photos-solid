import { linkOptions, SearchSchemaInput } from "@tanstack/solid-router";

import { Media } from "../../_models/Media";
import { MediaView, MediaViewGrid } from "../../_models/MediaView";
import { MediaViewRoute } from "../../_models/MediaViewRoute";
import { RouteDisplay } from "../../_models/RouteDisplay";
import { Uuid } from "../../_models/Uuid";

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

export interface FeedSearch {
    // favorites only
    f?: boolean;
    // a shuffled order, reproducible from the seed
    seed?: number;
}

/*
   What a feed's address may say. In the address rather than a store: it has to
   survive moving between a feed's listings, which are separate routes, and a
   reload or a shared link should reproduce the same feed. Anything that is not
   a favorites flag or a whole number of a seed is dropped.
*/
export const validateFeedSearch = (search: FeedSearch & SearchSchemaInput): FeedSearch => {
    // typed as what a link may pass; the address bar can hold anything
    const raw = search as unknown as Record<string, unknown>;
    const result: FeedSearch = {};

    if (raw.f === true || raw.f === "true") {
        result.f = true;
    }

    const seed = typeof raw.seed === "number" ? raw.seed : Number(raw.seed);

    if (raw.seed !== undefined && Number.isSafeInteger(seed)) {
        result.seed = seed;
    }

    return result;
};

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
                to: "/people/clans/$clanId/grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
                params: { clanId: subject.id, ...mediaParams(media) },
                search
            });
        case "place":
            return linkOptions({
                to: "/places/$placeId/media/grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
                params: { placeId: subject.id, ...mediaParams(media) },
                search
            });
        default:
            return linkOptions({
                to: "/people/$personId/grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
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
                to: "/people/clans/$clanId/categories",
                params: { clanId: subject.id },
                search
            });
        case "place":
            return linkOptions({
                to: "/places/$placeId/media/categories",
                params: { placeId: subject.id },
                search
            });
        default:
            return linkOptions({
                to: "/people/$personId/categories",
                params: { personId: subject.id },
                search
            });
    }
};

// a feed itself, which opens on whichever listing was used last
export const feedLink = (subject: FeedSubject) => {
    switch (subject.kind) {
        case "clan":
            return linkOptions({ to: "/people/clans/$clanId", params: { clanId: subject.id } });
        case "place":
            return linkOptions({ to: "/places/$placeId/media", params: { placeId: subject.id } });
        default:
            return linkOptions({ to: "/people/$personId", params: { personId: subject.id } });
    }
};
