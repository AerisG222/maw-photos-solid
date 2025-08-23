import { Component } from "solid-js";

import { useSearchGridViewSettingsContext } from "../_contexts/settings/SearchGridViewSettingsContext";
import { defaultGridThumbnailSize, getNextThumbnailSize } from "../_models/ThumbnailSize";
import { getNextMarginSize } from "../_models/Margin";

import ToolbarButton from "../_components/toolbar/ToolbarButton";

const GridToolbar: Component = () => {
    const [settingsContext, { setShowTitles, setShowYears, setThumbnailSize, setMargin }] =
        useSearchGridViewSettingsContext();

    const ensureLargeThumbnails = () => {
        setThumbnailSize(defaultGridThumbnailSize);
    };

    const onToggleYears = () => {
        setShowYears(!settingsContext.showYears);

        if (settingsContext.showYears) {
            ensureLargeThumbnails();
        }
    };

    const onToggleTitles = () => {
        setShowTitles(!settingsContext.showTitles);

        if (settingsContext.showTitles) {
            ensureLargeThumbnails();
        }
    };

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settingsContext.thumbnailSize).id);
    };

    const onToggleMargins = () => {
        setMargin(getNextMarginSize(settingsContext.margin).id);
    };

    return (
        <>
            <ToolbarButton
                icon="icon-[ic--round-today]"
                name="Years"
                tooltip="Show / Hide Years"
                clickHandler={onToggleYears}
            />
            <ToolbarButton
                icon="icon-[ic--round-title]"
                name="Titles"
                tooltip="Show / Hide Category Titles"
                clickHandler={onToggleTitles}
            />
            <ToolbarButton
                icon="icon-[ic--round-photo-size-select-large]"
                name="Thumbnail"
                tooltip="Toggle Grid Thumbnail Size"
                clickHandler={onToggleThumbnailSize}
                disabled={settingsContext.showTitles || settingsContext.showYears}
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

export default GridToolbar;
