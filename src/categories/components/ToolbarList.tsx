import { Component } from "solid-js";

import { useCategoryListViewSettingsContext } from "../../_contexts/settings/CategoryListViewSettingsContext";
import { getNextThumbnailSize } from "../../_models/ThumbnailSize";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const ListToolbar: Component = () => {
    const [settings, { setThumbnailSize, setDimThumbnails }] = useCategoryListViewSettingsContext();

    const onToggleThumbnail = () => {
        setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id);
    };

    const onToggleDimThumbnails = () => {
        setDimThumbnails(!settings.dimThumbnails);
    };

    return (
        <>
            <ToolbarButton
                icon="icon-[ic--round-density-medium]"
                name="Density"
                tooltip="Cycle Density"
                shortcutKeys={["s"]}
                clickHandler={onToggleThumbnail}
            />
            <ToolbarButton
                icon="icon-[ic--round-tonality]"
                name="Dim Thumbnails"
                tooltip="Toggle Thumbnail Dimming"
                shortcutKeys={["b"]}
                clickHandler={onToggleDimThumbnails}
                active={!settings.dimThumbnails}
            />
        </>
    );
};

export default ListToolbar;
