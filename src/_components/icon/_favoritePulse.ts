import { createSignal } from "solid-js";

import { Uuid } from "../../_models/Uuid";

/*
   Which item's favorite save just landed, if any.

   This cannot be a value watch inside FavoriteIcon. Saving invalidates the
   query with `refetchType: "all"`, so in the grids the refreshed data gives
   every item a new identity and the reference-keyed <For> replaces the whole
   tile - the icon that would have observed the change no longer exists, and its
   replacement mounts with the new value and nothing to compare against. In the
   detail view the opposite happens: the icon instance is reused across
   navigation, so watching the value there fires when a different photo is
   swapped in rather than when anything was saved.

   Routing the signal through the mutation instead means the pop is tied to the
   save itself, and survives the tile being rebuilt underneath it.
*/
const [pending, setPending] = createSignal<Uuid | undefined>();

// called from a mutation once the save succeeded and its refetch has landed
export const pulseFavorite = (id: Uuid) => setPending(id);

// true exactly once, for the first icon matching the saved item
export const claimFavoritePulse = (id: Uuid | undefined) => {
    if (id !== undefined && pending() === id) {
        setPending(undefined);

        return true;
    }

    return false;
};
