import { Accessor, createMemo } from "solid-js";

import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useMediaContext } from "../../_contexts/api/MediaContext";
import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { Uuid } from "../../_models/Uuid";
import { filterBrowsedMedia } from "../_browsedMedia";

/*
   One category's photos as browsing shows them - see _browsedMedia for which.

   Each filter's data is asked for only while that filter is on: the category's
   locations for the missing-GPS filter, the library's restrictions for the
   restricted one. The restrictions are one list for the whole library, shared
   by every category on the page.
*/
export const useBrowsedMedia = (categoryId: Accessor<Uuid | undefined>) => {
    const [area] = useAreaSettingsContext();
    const { categoryMediaQuery, categoryMediaGpsQuery } = useCategoriesContext();
    const { restrictedMediaQuery } = useMediaContext();

    const media = categoryMediaQuery(categoryId);
    const gps = categoryMediaGpsQuery(() =>
        area.categoryMissingGpsFilter ? categoryId() : undefined
    );
    const restricted = restrictedMediaQuery(() => area.categoryRestrictedFilter);

    const shown = createMemo(() =>
        filterBrowsedMedia(media.isSuccess ? media.data : undefined, {
            missingGps: area.categoryMissingGpsFilter,
            restrictedOnly: area.categoryRestrictedFilter,
            gps: gps.isSuccess ? gps.data : undefined,
            restricted: restricted.isSuccess ? restricted.data : undefined
        })
    );

    const queries = () => [
        media,
        ...(area.categoryMissingGpsFilter ? [gps] : []),
        ...(area.categoryRestrictedFilter ? [restricted] : [])
    ];

    return {
        // undefined until everything the filters need has arrived
        media: shown,
        error: () => findQueryError(queries()),
        retry: () => refetchQueries(queries())
    };
};
