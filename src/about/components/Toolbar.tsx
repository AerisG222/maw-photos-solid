import { Component } from "solid-js";
import { linkOptions } from "@tanstack/solid-router";

import { aboutAndroid, aboutHelp, aboutReleaseNotes } from "../_routes";

import NavGroup from "../../_components/toolbar/NavGroup";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

const Toolbar: Component = () => {
    return (
        <ToolbarLayout
            nav={
                <NavGroup
                    entries={[
                        { route: aboutHelp, link: linkOptions({ to: "/about/help" }) },
                        {
                            route: aboutReleaseNotes,
                            link: linkOptions({ to: "/about/release-notes" })
                        },
                        { route: aboutAndroid, link: linkOptions({ to: "/about/android" }) }
                    ]}
                />
            }
        />
    );
};

export default Toolbar;
