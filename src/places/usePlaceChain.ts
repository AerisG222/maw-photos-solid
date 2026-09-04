import { Accessor } from "solid-js";

import { usePlacesContext } from "../_contexts/api/PlacesContext";
import { PlaceChainLink } from "./components/PlaceChain";
import { Uuid } from "../_models/Uuid";

/*
   The chain of places above and including one place, ready to draw.

   Two reads, because the strip wants more than either gives on its own: the
   ancestors endpoint supplies the names and the order and always answers, while
   each place supplies the cover and the count. They are stitched here rather than
   in each screen, because the browse and the feeds over a place all show the same
   strip and must agree about it.

   The per-place reads share their cache with the single place read, so drilling
   down populates the chain on the way through and walking back up costs nothing.
*/
export const usePlaceChain = (placeId: Accessor<Uuid | undefined>) => {
    const { placesByIdQuery, placeAncestorsQuery } = usePlacesContext();

    const ancestors = placeAncestorsQuery(placeId);
    const ancestorIds = () => (ancestors.data ?? []).map(ancestor => ancestor.id);
    const places = placesByIdQuery(ancestorIds);

    return (): PlaceChainLink[] =>
        (ancestors.data ?? []).map((ancestor, idx) => ({
            id: ancestor.id,
            name: ancestor.name,
            kind: ancestor.kind,
            // undefined until the place lands; the strip draws an icon until then,
            // and keeps drawing one for a place whose cover was never chosen
            coverUrl: places[idx]?.data?.coverUrl,
            mediaCount: places[idx]?.data?.mediaCount
        }));
};
