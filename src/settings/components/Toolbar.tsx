import { ParentComponent } from "solid-js";
import { linkOptions } from "@tanstack/solid-router";

import {
    settingsAppearance,
    settingsCategories,
    settingsMedia,
    settingsPeople,
    settingsPlaces,
    settingsSearch,
    settingsShortcuts
} from "../_routes";

import NavGroup from "../../_components/toolbar/NavGroup";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import {
    settingsAppearanceRoute,
    settingsCategoriesRoute,
    settingsMediaRoute,
    settingsPeopleRoute,
    settingsPlacesRoute,
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
                            route: settingsCategories,
                            link: linkOptions({ to: settingsCategoriesRoute.to })
                        },
                        { route: settingsMedia, link: linkOptions({ to: settingsMediaRoute.to }) },
                        {
                            route: settingsPeople,
                            link: linkOptions({ to: settingsPeopleRoute.to })
                        },
                        {
                            route: settingsPlaces,
                            link: linkOptions({ to: settingsPlacesRoute.to })
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
