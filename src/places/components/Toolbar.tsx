import { Component, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { placeFeedBasePath } from "../../_media/feed/_routes";
import { Uuid } from "../../_models/Uuid";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

interface Props {
    // undefined at the root, where there is no one place to act on
    placeId: Uuid | undefined;
    canEdit: boolean;
    editing: boolean;
    toggleEditing: () => void;
}

/*
   What the places screen can do, as opposed to where it can go.

   Moving around the tree is the breadcrumb's job and only the breadcrumb's:
   these used to carry "All Places" and "Up one level" as well, which said the
   same thing in a less informative way - a rung names where it leads, while an
   arrow only promises a direction. "Up" was also wrong for the moment before the
   chain arrived, since it read its target from the same query the breadcrumb
   draws itself from, and answered the root while that was still in flight.
*/
const Toolbar: Component<Props> = props => {
    const navigate = useNavigate();

    return (
        <ToolbarLayout>
            <ToolbarButton
                icon="icon-[ic--round-image]"
                name="Photos"
                tooltip="Photos and Videos Taken Here"
                shortcutKeys={["p"]}
                disabled={!props.placeId}
                clickHandler={() => navigate(placeFeedBasePath(props.placeId!))}
            />

            {/*
                The corrections, offered only to the people who can actually make
                them - every write behind this is refused for everybody else. A
                mode rather than a second screen: it is the same tree either way,
                and crossing to a separate one used to drop the primary nav
                highlight.
            */}
            <Show when={props.canEdit}>
                <ToolbarButton
                    icon="icon-[ic--round-edit]"
                    name="Edit"
                    tooltip="Administer These Places"
                    shortcutKeys={["e"]}
                    active={props.editing}
                    clickHandler={() => props.toggleEditing()}
                />
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
