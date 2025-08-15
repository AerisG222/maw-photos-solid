import { Component } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../_contexts/settings/CategoryGridViewSettingsContext";
import { defaultGridThumbnailSize, getNextThumbnailSize } from "../_models/ThumbnailSize";
import { getNextMarginSize } from "../_models/Margin";

import ToolbarButton from "../_components/toolbar/ToolbarButton";

const GridToolbar: Component = () => {
    const [settings, { setShowTitles, setMargin, setThumbnailSize }] =
        useCategoryGridViewSettingsContext();

    const onToggleTitles = () => {
        setShowTitles(!settings.showTitles);

        if (settings.showTitles) {
            setThumbnailSize(defaultGridThumbnailSize);
        }
    };

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id);
    };

    const onToggleMargins = () => {
        setMargin(getNextMarginSize(settings.margin).id);
    };

    return (
        <>
            <ToolbarButton
                icon="icon-[ic--round-title]"
                name="Show / Hide Category Titles"
                shortcutKeys={["t"]}
                clickHandler={onToggleTitles}
            />
            <ToolbarButton
                icon="icon-[ic--round-photo-size-select-large]"
                name="Toggle Grid Thumbnail Size"
                shortcutKeys={["s"]}
                clickHandler={onToggleThumbnailSize}
                disabled={settings.showTitles}
            />
            <ToolbarButton
                icon="icon-[ic--round-format-indent-increase]"
                name="Toggle Category Margins"
                shortcutKeys={["m"]}
                clickHandler={onToggleMargins}
            />
        </>
    );
};

export default GridToolbar;
