import { Uuid } from "./Uuid";

/*
   The place administration writes, all of which answer with the place as it now
   stands so a screen can show the result rather than re-reading it.
*/

// publishes one of the caller's photographs as the place's cover. The media has
// to be at this place or beneath it, which is exactly what the place's own media
// listing offers
export interface SetPlaceCoverRequest {
    placeId: Uuid;
    mediaId: Uuid;
}

/*
   Folds `sourceId` into `placeId` and deletes it - the correction for a place
   the geocoder spelled two ways, or filed twice.

   Both must be the same kind, but they need not share a parent: the duplicate
   worth merging is usually the one filed in the wrong branch, and merging it is
   what makes the wrong branch disappear.
*/
export interface MergePlacesRequest {
    placeId: Uuid;
    sourceId: Uuid;
}

// moves a place under a different parent. `null` is meaningful rather than
// missing - it moves the place to the root, which only a country may do
export interface SetPlaceParentRequest {
    placeId: Uuid;
    parentId: Uuid | null;
}
