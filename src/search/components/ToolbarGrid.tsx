import { Component } from "solid-js";

import { useSearchGridViewSettingsContext } from "../../_contexts/settings/SearchGridViewSettingsContext";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const GridToolbar: Component = () => {
    const [settings, { setShowTitles, setThumbnailSize, setDimThumbnails, setShowFavoritesBadge }] =
        useSearchGridViewSettingsContext();

    const onToggleLabels = () => {
        setShowTitles(!settings.showTitles);
    };

    // the size is one of three named steps now, and this cycles them
    const onToggleDensity = () => {
        setThumbnailSize(settings.thumbnailSize);
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
                name="Labels"
                tooltip="Toggle Labels"
                shortcutKeys={["t"]}
                clickHandler={onToggleLabels}
                active={settings.showTitles}
            />
            <ToolbarButton
                icon="icon-[ic--round-density-medium]"
                name="Density"
                tooltip="Cycle Density"
                shortcutKeys={["s"]}
                clickHandler={onToggleDensity}
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
