import { Component } from "solid-js";

import { useSearchListViewSettingsContext } from "../_contexts/settings/SearchListViewSettingsContext";
import { getNextThumbnailSize } from "../_models/ThumbnailSize";
import { getNextMarginSize } from "../_models/Margin";

import ToolbarButton from "../_components/toolbar/ToolbarButton";

const ListToolbar: Component = () => {
    const [settingsContext, { setMargin, setThumbnailSize }] = useSearchListViewSettingsContext();

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settingsContext.thumbnailSize).id);
    };

    const onToggleMargins = () => {
        setMargin(getNextMarginSize(settingsContext.margin).id);
    };

    return (
        <>
            <ToolbarButton
                icon="icon-[ic--round-photo-size-select-large]"
                name="Thumbnail"
                tooltip="Toggle Grid Thumbnail Size"
                clickHandler={onToggleThumbnailSize}
            />
            <ToolbarButton
                icon="icon-[ic--round-format-indent-increase]"
                name="Margins"
                tooltip="Toggle Category Margins"
                clickHandler={onToggleMargins}
            />
        </>
    );
};

export default ListToolbar;
