import { Component } from "solid-js";

import { useSearchGridViewSettingsContext } from "../../_contexts/settings/SearchGridViewSettingsContext";
import { defaultGridThumbnailSize, getNextThumbnailSize } from "../../_models/ThumbnailSize";
import { getNextMarginSize } from "../../_models/Margin";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const GridToolbar: Component = () => {
    const [
        settings,
        {
            setShowTitles,
            setShowYears,
            setThumbnailSize,
            setMargin,
            setDimThumbnails,
            setShowFavoritesBadge
        }
    ] = useSearchGridViewSettingsContext();

    const ensureLargeThumbnails = () => {
        setThumbnailSize(defaultGridThumbnailSize);
    };

    const onToggleYears = () => {
        setShowYears(!settings.showYears);

        if (settings.showYears) {
            ensureLargeThumbnails();
        }
    };

    const onToggleTitles = () => {
        setShowTitles(!settings.showTitles);

        if (settings.showTitles) {
            ensureLargeThumbnails();
        }
    };

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id);
    };

    const onToggleMargins = () => {
        setMargin(getNextMarginSize(settings.margin).id);
    };

    const onToggleDimThumbnails = () => {
        setDimThumbnails(!settings.dimThumbnails);
    };

    const onToggleFavoritesBadge = () => {
        setShowFavoritesBadge(!settings.showFavoritesBadge);
    };

    return (
        <>
            <ToolbarButton
                icon="icon-[ic--round-today]"
                name="Years"
                tooltip="Toggle Years"
                clickHandler={onToggleYears}
            />
            <ToolbarButton
                icon="icon-[ic--round-title]"
                name="Titles"
                tooltip="Toggle Category Titles"
                clickHandler={onToggleTitles}
            />
            <ToolbarButton
                icon="icon-[ic--round-photo-size-select-large]"
                name="Thumbnail"
                tooltip="Toggle Thumbnail Size"
                clickHandler={onToggleThumbnailSize}
                disabled={settings.showTitles || settings.showYears}
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
                shortcutKeys={["d"]}
                clickHandler={onToggleDimThumbnails}
            />
            <ToolbarButton
                icon="icon-[mdi--heart]"
                name="Favorites"
                tooltip="Toggle Favorites Badge"
                shortcutKeys={["f"]}
                clickHandler={onToggleFavoritesBadge}
            />
        </>
    );
};

export default GridToolbar;
