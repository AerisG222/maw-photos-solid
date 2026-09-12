import { Component } from "solid-js";

import { usePeopleGridViewSettingsContext } from "../../_contexts/settings/PeopleGridViewSettingsContext";
import { getNextPersonSort, getPersonSortIcon, PersonSortName } from "../../_models/PersonSort";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

const Toolbar: Component = () => {
    const [settings, { setShowNames, setThumbnailSize, setDimThumbnails, setSortBy }] =
        usePeopleGridViewSettingsContext();

    return (
        <ToolbarLayout>
            <ToolbarButton
                icon={getPersonSortIcon(settings.sortBy)}
                name="Sort"
                tooltip={
                    settings.sortBy === PersonSortName ? "Sorted by Name" : "Sorted by Media Count"
                }
                shortcutKeys={["o"]}
                clickHandler={() => setSortBy(getNextPersonSort(settings.sortBy))}
            />
            <ToolbarButton
                icon="icon-[ic--round-title]"
                name="Labels"
                tooltip="Toggle Labels"
                shortcutKeys={["t"]}
                clickHandler={() => setShowNames(!settings.showNames)}
                active={settings.showNames}
            />
            <ToolbarButton
                icon="icon-[ic--round-density-medium]"
                name="Density"
                tooltip="Cycle Density"
                shortcutKeys={["s"]}
                // the size is one of three named steps now, and this cycles them
                clickHandler={() => setThumbnailSize(settings.thumbnailSize)}
            />
            <ToolbarButton
                icon="icon-[ic--round-tonality]"
                name="Dim Thumbnails"
                tooltip="Toggle Thumbnail Dimming"
                shortcutKeys={["b"]}
                clickHandler={() => setDimThumbnails(!settings.dimThumbnails)}
                active={!settings.dimThumbnails}
            />
        </ToolbarLayout>
    );
};

export default Toolbar;
