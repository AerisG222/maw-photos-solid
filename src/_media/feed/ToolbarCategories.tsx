import { Component } from "solid-js";

import { useFeedCategoryViewSettingsContext } from "../../_contexts/settings/FeedCategoryViewSettingsContext";

import RequestMoreButton from "../../_components/toolbar/RequestMoreButton";
import ToolbarButton from "../../_components/toolbar/ToolbarButton";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import ToolbarListing from "./ToolbarListing";

interface Props {
    basePath: string;
    favoritesOnly: boolean;
    canRequestMore: boolean;
    setFavoritesOnly: (favoritesOnly: boolean) => void;
    requestMore: () => void;
}

/*
   The toolbar for the categories listing.

   Only what applies here: no grid / detail / fullscreen links, because those are
   ways of looking at one photo, and no shuffle, because the API orders
   categories and takes no seed. Switching back to the media brings both back.
*/
const ToolbarCategories: Component<Props> = props => {
    const [settings, { setShowTitles, setThumbnailSize, setDimThumbnails, setShowFavoritesBadge }] =
        useFeedCategoryViewSettingsContext();

    // a card only has room for its title and year at the full size, so turning
    // either back on restores it - the same rule the search results follow

    const onToggleLabels = () => {
        setShowTitles(!settings.showTitles);
    };

    return (
        <ToolbarLayout>
            <ToolbarListing
                basePath={props.basePath}
                showingCategories={true}
                favoritesOnly={props.favoritesOnly}
            />

            <ToolbarDivider />

            <ToolbarButton
                icon="icon-[ic--round-filter-alt]"
                name="Favorites"
                tooltip="Show Favorites Only"
                shortcutKeys={["u"]}
                clickHandler={() => props.setFavoritesOnly(!props.favoritesOnly)}
                active={props.favoritesOnly}
            />

            <ToolbarDivider />

            <RequestMoreButton disabled={!props.canRequestMore} requestMore={props.requestMore} />

            <ToolbarDivider />

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
        </ToolbarLayout>
    );
};

export default ToolbarCategories;
