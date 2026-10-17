import { ParentComponent } from "solid-js";
import { linkOptions } from "@tanstack/solid-router";

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
                        {
                            route: settingsAppearance,
                            link: linkOptions({ to: "/settings/appearance" })
                        },
                        {
                            route: settingsBrowsing,
                            link: linkOptions({ to: "/settings/browsing" })
                        },
                        {
                            route: settingsCategories,
                            link: linkOptions({ to: "/settings/categories" })
                        },
                        { route: settingsMedia, link: linkOptions({ to: "/settings/media" }) },
                        { route: settingsPeople, link: linkOptions({ to: "/settings/people" }) },
                        { route: settingsSearch, link: linkOptions({ to: "/settings/search" }) },
                        {
                            route: settingsShortcuts,
                            link: linkOptions({ to: "/settings/shortcuts" })
                        }
                    ]}
                />
            }
        />
    );
};

export default Toolbar;
