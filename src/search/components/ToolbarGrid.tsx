import { Component } from "solid-js";

import { useSearchGridViewSettingsContext } from "../../_contexts/settings/SearchGridViewSettingsContext";
import { defaultGridThumbnailSize, getNextThumbnailSize } from "../../_models/ThumbnailSize";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const GridToolbar: Component = () => {
    const [
        settings,
        { setShowTitles, setShowYears, setThumbnailSize, setDimThumbnails, setShowFavoritesBadge }
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
        if (!settings.showTitles && !settings.showYears) {
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
                icon="icon-[ic--round-today]"
                name="Years"
                tooltip="Toggle Years"
                shortcutKeys={["y"]}
                clickHandler={onToggleYears}
                active={settings.showYears}
            />
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
                disabled={settings.showTitles || settings.showYears}
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
