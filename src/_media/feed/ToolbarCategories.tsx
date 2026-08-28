import { Component } from "solid-js";

import { useFeedCategoryViewSettingsContext } from "../../_contexts/settings/FeedCategoryViewSettingsContext";
import { getNextMarginSize } from "../../_models/Margin";
import { defaultGridThumbnailSize, getNextThumbnailSize } from "../../_models/ThumbnailSize";

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
    const [
        settings,
        {
            setShowTitles,
            setShowYears,
            setThumbnailSize,
            setMargin,
            setDimThumbnails,
            setShowFavoritesBadge,
            setShowTypesBadge
        }
    ] = useFeedCategoryViewSettingsContext();

    // a card only has room for its title and year at the full size, so turning
    // either back on restores it - the same rule the search results follow
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

    return (
        <ToolbarLayout>
            <ToolbarListing
                basePath={props.basePath}
                showingCategories={true}
                favoritesOnly={props.favoritesOnly}
            />

            <ToolbarDivider />

            <ToolbarButton
                icon="icon-[mdi--heart-box]"
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
                icon="icon-[ic--round-photo-size-select-large]"
                name="Thumbnail"
                tooltip="Toggle Thumbnail Size"
                shortcutKeys={["s"]}
                clickHandler={() =>
                    setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id)
                }
                disabled={settings.showTitles || settings.showYears}
            />
            <ToolbarButton
                icon="icon-[ic--round-format-indent-increase]"
                name="Margins"
                tooltip="Toggle Category Margins"
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
            <ToolbarButton
                icon="icon-[mdi--heart]"
                name="Favorite Badges"
                tooltip="Toggle Favorites Badge"
                shortcutKeys={["h"]}
                clickHandler={() => setShowFavoritesBadge(!settings.showFavoritesBadge)}
                active={settings.showFavoritesBadge}
            />
            <ToolbarButton
                icon="icon-[mdi--label]"
                name="Media Types"
                tooltip="Toggle Media Types Badge"
                shortcutKeys={["e"]}
                clickHandler={() => setShowTypesBadge(!settings.showTypesBadge)}
                active={settings.showTypesBadge}
            />
        </ToolbarLayout>
    );
};

export default ToolbarCategories;
