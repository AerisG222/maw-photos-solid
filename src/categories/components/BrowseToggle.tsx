import { Component } from "solid-js";

import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

/*
   Whether the categories grid lists each category's photos under it rather
   than a card for it. Remembered, like the area's other choices, so the grid
   opens the way it was left.
*/
const BrowseToggle: Component = () => {
    const [area, { setCategoryBrowseMedia }] = useAreaSettingsContext();

    return (
        <ToolbarButton
            icon="icon-[ic--round-perm-media]"
            name="Browse Photos"
            tooltip="Show every category's photos"
            shortcutKeys={["b"]}
            active={area.categoryBrowseMedia}
            clickHandler={() => setCategoryBrowseMedia(!area.categoryBrowseMedia)}
        />
    );
};

export default BrowseToggle;
