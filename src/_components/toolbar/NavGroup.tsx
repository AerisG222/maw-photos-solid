import { Component, Index, Show, createMemo } from "solid-js";

import { AppRouteDefinition } from "../../_models/AppRouteDefinition";

import ToolbarLink from "./ToolbarLink";

export interface NavEntry {
    route: AppRouteDefinition;
    href: string;
    // overrides the router's own match - see the note on ToolbarLink
    active?: boolean;
    // shown but dead, so a toolbar keeps its shape as its subject comes and goes
    disabled?: boolean;
    clickHandler?: () => void;
}

interface Props {
    entries: NavEntry[];
    /*
       Where this group's numbering starts, for a toolbar whose navigation is
       assembled from more than one group. A feed lists its media and its
       categories first, so its view links carry on from there rather than
       starting over at 1.
    */
    digitOffset?: number;
}

/*
   Where you can go from here.

   Seven toolbars each hand-rolled this row. More to the point, the keys were
   mnemonic and had run out: `g` for grid, `w` for detail, `f` for fullscreen,
   `z` for map, `/` for bulk edit, `k` for the listing switch - and `k` could
   only sit on whichever listing you were *not* in, because every other letter on
   the screen was taken.

   Digits, assigned by position, mean there is one rule to learn instead of
   twenty-two letters, and a collision is impossible rather than merely fixed.
   The cost is that the key no longer hints at the destination, which is what the
   labels and the reference dialog are for.

   **A group of one draws nothing.** A switch between a single option is not a
   switch; it is a link to the page you are already on, taking a slot in the bar
   and a digit with it. Two areas ended up here the moment fullscreen stopped
   being a view of its own - Random and every feed offer only the grid now - and
   the honest answer is that they have no view choice to offer rather than a
   choice of one.
*/
const NavGroup: Component<Props> = props => {
    return (
        <Show when={props.entries.length > 1}>
            <Index each={props.entries}>
                {(entry, idx) => {
                    /*
                   Built once for this position rather than on every read: the
                   array identity is what ShortcutWrapper keys its binding on, so
                   a fresh one each render would tear the binding down and rebuild
                   it continuously.
                */
                    const shortcutKeys = [String((props.digitOffset ?? 0) + idx + 1)];
                    const route = createMemo(() => ({ ...entry().route, shortcutKeys }));

                    return (
                        <ToolbarLink
                            href={entry().href}
                            route={route()}
                            active={entry().active}
                            disabled={entry().disabled}
                            clickHandler={entry().clickHandler}
                        />
                    );
                }}
            </Index>
        </Show>
    );
};

export default NavGroup;
