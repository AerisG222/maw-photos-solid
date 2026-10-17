import { Component } from "solid-js";
import { linkOptions } from "@tanstack/solid-router";

import { aboutAndroid, aboutHelp, aboutReleaseNotes } from "../_routes";

import NavGroup from "../../_components/toolbar/NavGroup";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import { aboutAndroidRoute, aboutHelpRoute, aboutReleaseNotesRoute } from "../_routeTree";

const Toolbar: Component = () => {
    return (
        <ToolbarLayout
            nav={
                <NavGroup
                    entries={[
                        { route: aboutHelp, link: linkOptions({ to: aboutHelpRoute.to }) },
                        {
                            route: aboutReleaseNotes,
                            link: linkOptions({ to: aboutReleaseNotesRoute.to })
                        },
                        { route: aboutAndroid, link: linkOptions({ to: aboutAndroidRoute.to }) }
                    ]}
                />
            }
        />
    );
};

export default Toolbar;
