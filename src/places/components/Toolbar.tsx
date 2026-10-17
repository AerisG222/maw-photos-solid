import { Component, Show } from "solid-js";

import { feedCategoriesLink, feedGridLink } from "../../_media/feed/_routes";
import { RouteDisplay } from "../../_models/RouteDisplay";
import { Uuid } from "../../_models/Uuid";
import { placeLink } from "../_routes";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import NavGroup from "../../_components/toolbar/NavGroup";

const mediaDisplay: RouteDisplay = {
    icon: "icon-[ic--round-image]",
    name: "Media",
    tooltip: "Media Taken Here"
};

const categoriesDisplay: RouteDisplay = {
    icon: "icon-[ic--round-collections]",
    name: "Categories",
    tooltip: "Categories With Media Taken Here"
};

interface Props {
    // undefined at the root, where there is no one place to act on
    placeId: Uuid | undefined;
    canEdit: boolean;
    editing: boolean;
    toggleEditing: () => void;
    chooseCover: () => void;
    move: () => void;
    merge: () => void;
}

/*
   What the places screen can do, as opposed to where it can go.

   Moving around the tree belongs to the chain above the listing and only to it:
   this used to carry "All Places" and "Up one level" as well, which said the same
   thing in a less informative way - a rung names where it leads, while an arrow
   only promises a direction.

   The two listings are here rather than beside the place they apply to, for the
   same reason every other area puts them here: a fixed position and a digit. They
   are the same pair the feed itself shows, drawn the same way - neither is lit,
   because standing on a place is standing in neither of them.

   At the root they are dead rather than absent: there is no one place to list,
   and a toolbar that changed width as you drilled would be worse than one with a
   pair of gray entries in it.

   The corrections appear only while editing, next to the toggle that revealed
   them. They act on the place the chain says you are on, so at the root - where
   there is no such place - they are offered but disabled rather than hidden,
   which keeps the toolbar from changing width as you drill.
*/
const Toolbar: Component<Props> = props => {
    /*
       The media taken here, and the categories holding it - the same two
       listings a place's feed switches between. At the root there is no one
       place to list, so they are shown disabled; a disabled entry never
       navigates, so it points at the tree itself.
    */
    const mediaLink = () =>
        props.placeId ? feedGridLink({ kind: "place", id: props.placeId }) : placeLink();

    const categoriesLink = () =>
        props.placeId
            ? feedCategoriesLink({ kind: "place", id: props.placeId }, false)
            : placeLink();

    return (
        <ToolbarLayout
            nav={
                <NavGroup
                    entries={[
                        {
                            route: mediaDisplay,
                            link: mediaLink(),
                            active: false,
                            disabled: !props.placeId
                        },
                        {
                            route: categoriesDisplay,
                            link: categoriesLink(),
                            active: false,
                            disabled: !props.placeId
                        }
                    ]}
                />
            }
        >
            <Show when={props.canEdit}>
                <ToolbarDivider />

                <ToolbarButton
                    icon="icon-[ic--round-edit]"
                    name="Edit"
                    tooltip="Administer These Places"
                    shortcutKeys={["e"]}
                    active={props.editing}
                    clickHandler={() => props.toggleEditing()}
                />

                <Show when={props.editing}>
                    <ToolbarButton
                        icon="icon-[ic--round-photo-camera]"
                        name="Cover"
                        tooltip="Choose This Place's Cover"
                        shortcutKeys={["c"]}
                        disabled={!props.placeId}
                        clickHandler={() => props.chooseCover()}
                    />
                    <ToolbarButton
                        icon="icon-[ic--round-drive-file-move]"
                        name="Move"
                        tooltip="Move This Place"
                        shortcutKeys={["m"]}
                        disabled={!props.placeId}
                        clickHandler={() => props.move()}
                    />
                    <ToolbarButton
                        icon="icon-[ic--round-merge-type]"
                        name="Merge"
                        tooltip="Merge Another Place Into This One"
                        shortcutKeys={["g"]}
                        disabled={!props.placeId}
                        clickHandler={() => props.merge()}
                    />
                </Show>
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
