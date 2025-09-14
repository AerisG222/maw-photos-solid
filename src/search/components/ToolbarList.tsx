import { Component } from "solid-js";

import { useSearchListViewSettingsContext } from "../../_contexts/settings/SearchListViewSettingsContext";
import { getNextThumbnailSize } from "../../_models/ThumbnailSize";
import { getNextMarginSize } from "../../_models/Margin";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const ListToolbar: Component = () => {
    const [settings, { setMargin, setThumbnailSize, setDimThumbnails }] =
        useSearchListViewSettingsContext();

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id);
    };

    const onToggleMargins = () => {
        setMargin(getNextMarginSize(settings.margin).id);
    };

    const onToggleDimThumbnails = () => {
        setDimThumbnails(!settings.dimThumbnails);
    };

    return (
        <>
            <ToolbarButton
                icon="icon-[ic--round-photo-size-select-large]"
                name="Thumbnail"
                tooltip="Toggle Thumbnail Size"
                clickHandler={onToggleThumbnailSize}
            />
            <ToolbarButton
                icon="icon-[ic--round-format-indent-increase]"
                name="Margins"
                tooltip="Toggle Category Margins"
                clickHandler={onToggleMargins}
            />
            <ToolbarButton
                icon="icon-[mdi--lightbulb-dimmer-50]"
                name="Dim Thumbnails"
                tooltip="Toggle Thumbnail Dimming"
                shortcutKeys={["b"]}
                clickHandler={onToggleDimThumbnails}
            />
        </>
    );
};

export default ListToolbar;
