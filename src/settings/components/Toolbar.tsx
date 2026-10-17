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
import {
    settingsAppearanceRoute,
    settingsBrowsingRoute,
    settingsCategoriesRoute,
    settingsMediaRoute,
    settingsPeopleRoute,
    settingsSearchRoute,
    settingsShortcutsRoute
} from "../_routeTree";

const Toolbar: ParentComponent = () => {
    return (
        <ToolbarLayout
            nav={
                <NavGroup
                    entries={[
                        {
                            route: settingsAppearance,
                            link: linkOptions({ to: settingsAppearanceRoute.to })
                        },
                        {
                            route: settingsBrowsing,
                            link: linkOptions({ to: settingsBrowsingRoute.to })
                        },
                        {
                            route: settingsCategories,
                            link: linkOptions({ to: settingsCategoriesRoute.to })
                        },
                        { route: settingsMedia, link: linkOptions({ to: settingsMediaRoute.to }) },
                        {
                            route: settingsPeople,
                            link: linkOptions({ to: settingsPeopleRoute.to })
                        },
                        {
                            route: settingsSearch,
                            link: linkOptions({ to: settingsSearchRoute.to })
                        },
                        {
                            route: settingsShortcuts,
                            link: linkOptions({ to: settingsShortcutsRoute.to })
                        }
                    ]}
                />
            }
        />
    );
};

export default Toolbar;
