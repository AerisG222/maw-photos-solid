import { Component, For } from "solid-js";
import { A } from "@solidjs/router";

import { PlaceAncestor } from "../../_models/Place";
import { Uuid } from "../../_models/Uuid";

interface Props {
    // country first and including the place itself, which is the order and the
    // content the API returns
    ancestors: PlaceAncestor[];
    // built by the caller so the chain keeps whatever mode the screen is in -
    // walking up out of edit mode and losing it halfway would be its own puzzle
    buildPath: (id?: Uuid) => string;
}

/*
   Where in the tree the screen currently is, and the way back out of it.

   Every rung is a link, the last one included: it is the level being looked at,
   and following it is how a merge or a move that changed the chain gets a fresh
   read of it.
*/
const PlaceBreadcrumb: Component<Props> = props => {
    return (
        <div class="flex flex-wrap items-center justify-center gap-1 my-2">
            <A class="text-primary hover:underline" href={props.buildPath()}>
                All Places
            </A>

            <For each={props.ancestors}>
                {ancestor => (
                    <>
                        <span class="text-xl align-middle icon-[ic--round-arrow-right] opacity-60" />

                        <A class="text-primary hover:underline" href={props.buildPath(ancestor.id)}>
                            {ancestor.name}
                        </A>
                    </>
                )}
            </For>
        </div>
    );
};

export default PlaceBreadcrumb;
