import { Component } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../../_contexts/settings/CategoryGridViewSettingsContext";
import { defaultGridThumbnailSize, getNextThumbnailSize } from "../../_models/ThumbnailSize";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const GridToolbar: Component = () => {
    const [settings, { setShowTitles, setThumbnailSize, setDimThumbnails, setShowFavoritesBadge }] =
        useCategoryGridViewSettingsContext();

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

    const onToggleDimThumbnails = () => {
        setDimThumbnails(!settings.dimThumbnails);
    };

    const onToggleFavoritesBadge = () => {
        setShowFavoritesBadge(!settings.showFavoritesBadge);
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
                icon="icon-[ic--round-density-medium]"
                name="Density"
                tooltip="Cycle Density"
                shortcutKeys={["s"]}
                clickHandler={onToggleThumbnailSize}
                disabled={settings.showTitles}
            />
            <ToolbarButton
                icon="icon-[ic--round-tonality]"
                name="Dim Thumbnails"
                tooltip="Toggle Thumbnail Dimming"
                shortcutKeys={["b"]}
                clickHandler={onToggleDimThumbnails}
                active={!settings.dimThumbnails}
            />
            <ToolbarButton
                icon="icon-[ic--round-label]"
                name="Badges"
                tooltip="Toggle Badges"
                shortcutKeys={["h"]}
                clickHandler={onToggleFavoritesBadge}
                active={settings.showFavoritesBadge}
            />
        </>
    );
};

export default GridToolbar;
