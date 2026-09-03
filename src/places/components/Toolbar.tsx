import { Component, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { feedListingPath, placeFeedBasePath } from "../../_media/feed/_routes";
import { Uuid } from "../../_models/Uuid";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

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
   same reason every other area puts them here: a fixed position and a key, and
   the feed they lead to switches between them from its own toolbar on the same
   `k`.

   The corrections appear only while editing, next to the toggle that revealed
   them. They act on the place the chain says you are on, so at the root - where
   there is no such place - they are offered but disabled rather than hidden,
   which keeps the toolbar from changing width as you drill.
*/
const Toolbar: Component<Props> = props => {
    const navigate = useNavigate();

    const feedPath = () => placeFeedBasePath(props.placeId!);

    return (
        <ToolbarLayout>
            <ToolbarButton
                icon="icon-[ic--round-image]"
                name="Photos"
                tooltip="Photos and Videos Taken Here"
                shortcutKeys={["p"]}
                disabled={!props.placeId}
                clickHandler={() => navigate(feedPath())}
            />
            <ToolbarButton
                icon="icon-[ic--round-collections]"
                name="Categories"
                tooltip="Categories With Media Taken Here"
                shortcutKeys={["k"]}
                disabled={!props.placeId}
                clickHandler={() => navigate(feedListingPath(feedPath(), "categories", false))}
            />

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
