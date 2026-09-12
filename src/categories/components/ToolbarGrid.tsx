import { Component } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../../_contexts/settings/CategoryGridViewSettingsContext";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

/*
   Labels, density, dimming, badges - the same four questions every listing in
   the application asks, which is why they all write to one store now.

   The rule that used to tie the first two together is gone. Turning titles on
   forced the largest thumbnail and greyed the size control out, because the tile
   reserved no room for a label. Density is three named steps rather than a pixel
   size now, so the coupling had stopped meaning anything - and with labels on by
   default it had begun disabling the density button outright.
*/
const GridToolbar: Component = () => {
    const [settings, { setShowTitles, setThumbnailSize, setDimThumbnails, setShowFavoritesBadge }] =
        useCategoryGridViewSettingsContext();

    return (
        <>
            <ToolbarButton
                icon="icon-[ic--round-title]"
                name="Labels"
                tooltip="Toggle Labels"
                shortcutKeys={["t"]}
                clickHandler={() => setShowTitles(!settings.showTitles)}
                active={settings.showTitles}
            />
            <ToolbarButton
                icon="icon-[ic--round-density-medium]"
                name="Density"
                tooltip="Cycle Density"
                shortcutKeys={["s"]}
                // the size is one of three named steps now, and this cycles them
                clickHandler={() => setThumbnailSize(settings.thumbnailSize)}
            />
            <ToolbarButton
                icon="icon-[ic--round-tonality]"
                name="Dim Thumbnails"
                tooltip="Toggle Thumbnail Dimming"
                shortcutKeys={["b"]}
                clickHandler={() => setDimThumbnails(!settings.dimThumbnails)}
                active={!settings.dimThumbnails}
            />
            <ToolbarButton
                icon="icon-[ic--round-label]"
                name="Badges"
                tooltip="Toggle Badges"
                shortcutKeys={["h"]}
                clickHandler={() => setShowFavoritesBadge(!settings.showFavoritesBadge)}
                active={settings.showFavoritesBadge}
            />
        </>
    );
};

export default GridToolbar;
