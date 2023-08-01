import { Component } from "solid-js";

import { useCategoryListViewSettingsContext } from "../contexts/settings/CategoryListViewSettingsContext";
import { getNextThumbnailSize } from "../_models/ThumbnailSize";
import { getNextMarginSize } from "../_models/Margin";

import ToolbarButton from "../components/toolbar/ToolbarButton";

const ListToolbar: Component = () => {
    const [settings, { setThumbnailSize, setMargin }] = useCategoryListViewSettingsContext();

    const onToggleThumbnail = () => {
        setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id)
    };

    const onToggleMargins = () => {
        setMargin(getNextMarginSize(settings.margin).id);
    };

    return (
        <>
            <ToolbarButton
                icon="i-ic-round-photo-size-select-large"
                name="Toggle List Thumbnail Size (S)"
                shortcutKeys={["s"]}
                clickHandler={onToggleThumbnail}
            />
            <ToolbarButton
                icon="i-ic-round-format-indent-increase"
                name="Toggle Category Margins (M)"
                shortcutKeys={["m"]}
                clickHandler={onToggleMargins}
            />
        </>
    );
};

export default ListToolbar;
