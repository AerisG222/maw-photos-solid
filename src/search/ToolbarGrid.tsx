import { Component } from "solid-js";

import { useSearchGridViewSettingsContext } from "../contexts/settings/SearchGridViewSettingsContext";
import { defaultGridThumbnailSize, getNextThumbnailSize } from "../_models/ThumbnailSize";
import { getNextMarginSize } from "../_models/Margin";

import ToolbarButton from "../components/toolbar/ToolbarButton";

const GridToolbar: Component = () => {
    const [settingsContext, { setShowTitles, setShowYears, setThumbnailSize, setMargin }] = useSearchGridViewSettingsContext();

    const ensureLargeThumbnails = () => {
        setThumbnailSize(defaultGridThumbnailSize);
    };

    const onToggleYears = () => {
        setShowYears(!settingsContext.showYears);

        if(settingsContext.showYears) {
            ensureLargeThumbnails();
        }
    };

    const onToggleTitles = () => {
        setShowTitles(!settingsContext.showTitles);

        if(settingsContext.showTitles) {
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
                icon="i-ic-round-today"
                name="Show / Hide Years"
                clickHandler={onToggleYears}
            />
            <ToolbarButton
                icon="i-ic-round-title"
                name="Show / Hide Category Titles"
                clickHandler={onToggleTitles}
            />
            <ToolbarButton
                icon="i-ic-round-photo-size-select-large"
                name="Toggle Grid Thumbnail Size"
                clickHandler={onToggleThumbnailSize}
                disabled={settingsContext.showTitles || settingsContext.showYears}
            />
            <ToolbarButton
                icon="i-ic-round-format-indent-increase"
                name="Toggle Category Margins"
                clickHandler={onToggleMargins}
            />
        </>
    );
};

export default GridToolbar;
