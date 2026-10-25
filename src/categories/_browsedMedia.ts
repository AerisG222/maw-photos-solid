import { GpsDetail } from "../_models/GpsDetail";
import { Media } from "../_models/Media";
import { RestrictedMedia } from "../_models/RestrictedMedia";

/*
   Which of a category's photos to show under it while browsing, given the
   listing's filters.

   The filters on the categories page pick categories: those with a photo
   missing a location, those with a restricted photo. Browsing their photos,
   the same filter narrows the photos too - an admin looking for the photos
   without a location wants those, not the rest of the category around them.

   Undefined while anything a filter needs has not arrived, so a category is
   never shown in full and then shrinks.
*/
export interface BrowseFilters {
    // the category's locations, when only the photos without one are wanted
    gps?: GpsDetail[] | undefined;
    // every restricted photo, when only those are wanted
    restricted?: RestrictedMedia[] | undefined;
    missingGps: boolean;
    restrictedOnly: boolean;
}

// a location recorded by the camera or set by hand - an entry with neither is no location
const isLocated = (detail: GpsDetail) => !!detail.recorded || !!detail.override;

export const filterBrowsedMedia = (
    media: Media[] | undefined,
    filters: BrowseFilters
): Media[] | undefined => {
    if (!media) {
        return undefined;
    }

    let shown = media;

    if (filters.missingGps) {
        if (!filters.gps) {
            return undefined;
        }

        const located = new Set(filters.gps.filter(isLocated).map(detail => detail.mediaId));

        shown = shown.filter(item => !located.has(item.id));
    }

    if (filters.restrictedOnly) {
        if (!filters.restricted) {
            return undefined;
        }

        const restricted = new Set(filters.restricted.map(item => item.mediaId));

        shown = shown.filter(item => restricted.has(item.id));
    }

    return shown;
};
