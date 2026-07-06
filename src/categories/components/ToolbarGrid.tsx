import { Component } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../../_contexts/settings/CategoryGridViewSettingsContext";
import { defaultGridThumbnailSize, getNextThumbnailSize } from "../../_models/ThumbnailSize";
import { getNextMarginSize } from "../../_models/Margin";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const GridToolbar: Component = () => {
    const [
        settings,
        {
            setShowTitles,
            setMargin,
            setThumbnailSize,
            setDimThumbnails,
            setShowFavoritesBadge,
            setShowTypesBadge
        }
    ] = useCategoryGridViewSettingsContext();

    const onToggleTitles = () => {
        setShowTitles(!settings.showTitles);

        if (settings.showTitles) {
            setThumbnailSize(defaultGridThumbnailSize);
        }
    };

    const onToggleThumbnailSize = () => {
        if (!settings.showTitles) {
            setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id);
        }
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

    const onToggleTypesBadge = () => {
        setShowTypesBadge(!settings.showTypesBadge);
    };

    return (
        <>
            <ToolbarButton
                icon="icon-[ic--round-title]"
                name="Titles"
                tooltip="Toggle Category Titles"
                shortcutKeys={["t"]}
                clickHandler={onToggleTitles}
                active={settings.showTitles}
            />
            <ToolbarButton
                icon="icon-[ic--round-photo-size-select-large]"
                name="Thumbnail"
                tooltip="Toggle Thumbnail Size"
                shortcutKeys={["s"]}
                clickHandler={onToggleThumbnailSize}
                disabled={settings.showTitles}
            />
            <ToolbarButton
                icon="icon-[ic--round-format-indent-increase]"
                name="Margins"
                tooltip="Toggle Category Margins"
                shortcutKeys={["m"]}
                clickHandler={onToggleMargins}
            />
            <ToolbarButton
                icon="icon-[mdi--lightbulb-dimmer-50]"
                name="Dim Thumbnails"
                tooltip="Toggle Thumbnail Dimming"
                shortcutKeys={["b"]}
                clickHandler={onToggleDimThumbnails}
                active={!settings.dimThumbnails}
            />
            <ToolbarButton
                icon="icon-[mdi--heart]"
                name="Favorites"
                tooltip="Toggle Favorites Badge"
                shortcutKeys={["h"]}
                clickHandler={onToggleFavoritesBadge}
                active={settings.showFavoritesBadge}
            />
            <ToolbarButton
                icon="icon-[mdi--label]"
                name="Media Types"
                tooltip="Toggle Media Types Badge"
                shortcutKeys={["e"]}
                clickHandler={onToggleTypesBadge}
                active={settings.showTypesBadge}
            />
        </>
    );
};

export default GridToolbar;
