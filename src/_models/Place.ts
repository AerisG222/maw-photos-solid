import { KeyValuePair } from "./KeyValuePair";
import { Uuid } from "./Uuid";

/*
   The three levels of the place tree, as the API names them.

   A country's children are usually its states, but not always - Macao and Hong
   Kong have no state level, so their cities hang straight off the country. That
   is why the API returns `kind` per place rather than leaving a client to infer
   it from how deep it drilled, and why nothing here derives a level from depth.
*/
export const PlaceKindCountry = "country";
export const PlaceKindState = "state";
export const PlaceKindCity = "city";

export type PlaceKind = typeof PlaceKindCountry | typeof PlaceKindState | typeof PlaceKindCity;

export const allPlaceKinds: KeyValuePair<PlaceKind>[] = [
    { id: PlaceKindCountry, name: "Countries" },
    { id: PlaceKindState, name: "States" },
    { id: PlaceKindCity, name: "Cities" }
];

// singular, for labelling one place rather than a listing of them
export const getPlaceKindName = (kind: PlaceKind) => {
    switch (kind) {
        case PlaceKindCountry:
            return "Country";
        case PlaceKindState:
            return "State or Region";
        default:
            return "City";
    }
};

// how far down the tree a kind sits, so the kinds that may parent another are
// worked out from one definition rather than a chain of comparisons per screen
const placeKindLevels: Record<PlaceKind, number> = {
    [PlaceKindCountry]: 10,
    [PlaceKindState]: 20,
    [PlaceKindCity]: 30
};

/*
   The kinds that may sit above `kind` in the tree - the client side of the rule
   the API enforces when a place is moved. A country has none: the only place it
   can go is the root.
*/
export const getParentPlaceKinds = (kind: PlaceKind): PlaceKind[] =>
    allPlaceKinds.map(k => k.id).filter(k => placeKindLevels[k] < placeKindLevels[kind]);

/*
   A browsable location: a country, a state or a city.

   Deliberately flat, mirroring the API - the hierarchy is expressed by
   `parentId` alone, because a client asks for one level at a time and never has
   a use for the whole tree at once.

   `mediaCount` covers the whole subtree and is scoped to what the caller may
   see, so it can be shown as-is.

   `coverUrl` is an admin's hand picked photograph representing the place, served
   from a directory that skips the per-file access check - so it renders for
   anyone signed in, and a plain <img> with the service worker's bearer token is
   all it takes. It carries a `?v=` stamped from when the cover was published, so
   replacing one is visible immediately rather than after a cache expires.
   `coverMediaId` names the photograph it was published *from*, which is what
   lets a picker show the current choice as selected - the url cannot, since it
   names the published copy.
*/
export interface Place {
    id: Uuid;
    parentId: Uuid | null;
    kind: PlaceKind;
    name: string;
    slug: string;
    mediaCount: number;
    // the names above this place, root first and excluding itself. Empty for a
    // country. It is what makes a search result legible: this library holds two
    // cities called Zhuhai, both under a parent called Guangdong, and only the
    // grandparent tells them apart
    ancestorNames: string[];
    coverUrl: string | null;
    coverMediaId: Uuid | null;
}

/*
   One rung of the breadcrumb above a place. Not a `Place` - it labels a path
   rather than offering a tile, so it carries no counts and no cover.

   `depth` is 1-based from the country, and the API returns the chain in order,
   including the place itself.
*/
export interface PlaceAncestor {
    id: Uuid;
    parentId: Uuid | null;
    kind: PlaceKind;
    name: string;
    slug: string;
    depth: number;
}

// "Massachusetts, United States" - the ancestors of a place, nearest first,
// which is how an address reads
export const describePlaceAncestry = (place: Place) =>
    [...place.ancestorNames].reverse().join(", ");
