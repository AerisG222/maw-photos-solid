import { Component } from "solid-js";

import { usePeopleGridViewSettingsContext } from "../../_contexts/settings/PeopleGridViewSettingsContext";
import { getNextMarginSize } from "../../_models/Margin";
import { getNextPersonSort, getPersonSortIcon, PersonSortName } from "../../_models/PersonSort";
import { getNextThumbnailSize } from "../../_models/ThumbnailSize";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

const Toolbar: Component = () => {
    const [
        settings,
        {
            setShowNames,
            setShowMediaCounts,
            setThumbnailSize,
            setMargin,
            setDimThumbnails,
            setSortBy
        }
    ] = usePeopleGridViewSettingsContext();

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
                name="Names"
                tooltip="Toggle Names"
                shortcutKeys={["t"]}
                clickHandler={() => setShowNames(!settings.showNames)}
                active={settings.showNames}
            />
            <ToolbarButton
                icon="icon-[mdi--counter]"
                name="Counts"
                tooltip="Toggle Media Counts"
                shortcutKeys={["c"]}
                clickHandler={() => setShowMediaCounts(!settings.showMediaCounts)}
                active={settings.showMediaCounts}
            />
            <ToolbarButton
                icon="icon-[ic--round-photo-size-select-large]"
                name="Thumbnail"
                tooltip="Toggle Thumbnail Size"
                shortcutKeys={["s"]}
                clickHandler={() =>
                    setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id)
                }
            />
            <ToolbarButton
                icon="icon-[ic--round-format-indent-increase]"
                name="Margins"
                tooltip="Toggle Margins"
                shortcutKeys={["m"]}
                clickHandler={() => setMargin(getNextMarginSize(settings.margin).id)}
            />
            <ToolbarButton
                icon="icon-[mdi--lightbulb-dimmer-50]"
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
