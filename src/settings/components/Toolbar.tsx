import { ParentComponent } from "solid-js";

import {
    settingsAppearance,
    settingsBrowsing,
    settingsCategories,
    settingsMedia,
    settingsPeople,
    settingsSearch,
    settingsShortcuts
} from "../_routes";

import NavGroup from "../../_components/toolbar/NavGroup";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

const Toolbar: ParentComponent = () => {
    return (
        <ToolbarLayout
            nav={
                <NavGroup
                    entries={[
                        { route: settingsAppearance, href: settingsAppearance.absolutePath },
                        { route: settingsBrowsing, href: settingsBrowsing.absolutePath },
                        { route: settingsCategories, href: settingsCategories.absolutePath },
                        { route: settingsMedia, href: settingsMedia.absolutePath },
                        { route: settingsPeople, href: settingsPeople.absolutePath },
                        { route: settingsSearch, href: settingsSearch.absolutePath },
                        { route: settingsShortcuts, href: settingsShortcuts.absolutePath }
                    ]}
                />
            }
        />
    );
};

export default Toolbar;
