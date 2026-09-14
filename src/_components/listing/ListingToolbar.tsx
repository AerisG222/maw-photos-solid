import { Component, Show } from "solid-js";

import { useListingSettingsContext } from "../../_contexts/settings/ListingSettingsContext";
import { getNextPersonSort, getPersonSortIcon, PersonSortName } from "../../_models/PersonSort";

import ToolbarButton from "../toolbar/ToolbarButton";

interface Props {
    // ordering, which only the people grid offers
    sort?: boolean;
    // the text under an item - a title, a year, a name, a count
    labels?: boolean;
    // the favourite heart and the media-type icons on a tile
    badges?: boolean;
    // media listings only
    faces?: boolean;
}

/*
   How a listing presents its items, offered the same way everywhere.

   Eight toolbars carried their own copy of these: categories in grid and list,
   search in grid and list, people, a feed's categories, and the media grid and
   detail views. They had drifted in every way something can - different icons
   for the same idea, different keys, different tooltips, and controls that
   existed in one listing and not the next.

   Which controls a listing offers is still its own decision, because not every
   listing has labels worth showing or items that can be favourited. What is
   *not* its decision any more is what they look like, what they are called,
   which key presses them, or what order they sit in - so moving between two
   listings no longer means re-learning the same row.

   The settings come straight from the one store rather than through a screen's
   own context, which is what makes a change here follow you into the next
   listing.
*/
const ListingToolbar: Component<Props> = props => {
    const [settings, { setShowLabels, setShowBadges, setHighlightFaces, setPeopleSort }] =
        useListingSettingsContext();

    return (
        <>
            <Show when={props.sort}>
                <ToolbarButton
                    icon={getPersonSortIcon(settings.peopleSort)}
                    name="Sort"
                    tooltip={
                        settings.peopleSort === PersonSortName
                            ? "Sorted by Name"
                            : "Sorted by Media Count"
                    }
                    shortcutKeys={["o"]}
                    clickHandler={() => setPeopleSort(getNextPersonSort(settings.peopleSort))}
                />
            </Show>

            <Show when={props.labels}>
                <ToolbarButton
                    icon="icon-[ic--round-title]"
                    name="Labels"
                    tooltip="Toggle Labels"
                    shortcutKeys={["t"]}
                    clickHandler={() => setShowLabels(!settings.showLabels)}
                    active={settings.showLabels}
                />
            </Show>

            <Show when={props.badges}>
                <ToolbarButton
                    icon="icon-[ic--round-label]"
                    name="Badges"
                    tooltip="Toggle Badges"
                    shortcutKeys={["h"]}
                    clickHandler={() => setShowBadges(!settings.showBadges)}
                    active={settings.showBadges}
                />
            </Show>

            <Show when={props.faces}>
                <ToolbarButton
                    icon="icon-[ic--round-face-retouching-natural]"
                    name="Faces"
                    tooltip="Toggle Face Highlighting"
                    shortcutKeys={["q"]}
                    clickHandler={() => setHighlightFaces(!settings.highlightFaces)}
                    active={settings.highlightFaces}
                />
            </Show>
        </>
    );
};

export default ListingToolbar;
