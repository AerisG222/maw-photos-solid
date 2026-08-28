import { Component } from "solid-js";

import { useMediaGridViewSettingsContext } from "../../_contexts/settings/MediaGridViewSettingsContext";
import { getNextMarginSize } from "../../_models/Margin";
import { getNextThumbnailSize } from "../../_models/ThumbnailSize";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import ToolbarListing from "./ToolbarListing";

interface Props {
    basePath: string;
    favoritesOnly: boolean;
    setFavoritesOnly: (favoritesOnly: boolean) => void;
}

/*
   The toolbar for the categories listing.

   Only what applies here: no grid / detail / fullscreen links, because those are
   ways of looking at one photo, and no shuffle, because the API orders
   categories and takes no seed. Switching back to the media brings both back.
*/
const ToolbarCategories: Component<Props> = props => {
    const [settings, { setThumbnailSize, setMargin, setDimThumbnails }] =
        useMediaGridViewSettingsContext();

    return (
        <ToolbarLayout>
            <ToolbarListing
                basePath={props.basePath}
                showingCategories={true}
                favoritesOnly={props.favoritesOnly}
            />

            <ToolbarDivider />

            <ToolbarButton
                icon="icon-[mdi--heart]"
                name="Favorites"
                tooltip="Show Favorites Only"
                shortcutKeys={["u"]}
                clickHandler={() => props.setFavoritesOnly(!props.favoritesOnly)}
                active={props.favoritesOnly}
            />

            <ToolbarDivider />

            <ToolbarButton
                icon="icon-[ic--round-photo-size-select-large]"
                name="Thumbnails"
                tooltip="Toggle Thumbnail Size"
                shortcutKeys={["s"]}
                clickHandler={() =>
                    setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id)
                }
            />
            <ToolbarButton
                icon="icon-[ic--round-format-indent-increase]"
                name="Margins"
                tooltip="Toggle Margins"
                shortcutKeys={["m"]}
                clickHandler={() => setMargin(getNextMarginSize(settings.margin).id)}
            />
            <ToolbarButton
                icon="icon-[mdi--lightbulb-dimmer-50]"
                name="Dim Thumbnails"
                tooltip="Toggle Thumbnail Dimming"
                shortcutKeys={["b"]}
                clickHandler={() => setDimThumbnails(!settings.dimThumbnails)}
                active={!settings.dimThumbnails}
            />
        </ToolbarLayout>
    );
};

export default ToolbarCategories;
