import { Component } from "solid-js";

import { aboutAndroid, aboutHelp, aboutReleaseNotes } from "../_routes";

import NavGroup from "../../_components/toolbar/NavGroup";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

const Toolbar: Component = () => {
    return (
        <ToolbarLayout>
            <NavGroup
                entries={[
                    { route: aboutHelp, href: aboutHelp.absolutePath },
                    { route: aboutReleaseNotes, href: aboutReleaseNotes.absolutePath },
                    { route: aboutAndroid, href: aboutAndroid.absolutePath }
                ]}
            />
        </ToolbarLayout>
    );
};

export default Toolbar;
