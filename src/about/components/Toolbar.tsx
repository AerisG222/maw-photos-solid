import { Component } from "solid-js";

import { aboutAndroid, aboutHelp, aboutReleaseNotes } from "../_routes";

import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import ToolbarLink from "../../_components/toolbar/ToolbarLink";

const Toolbar: Component = () => {
    return (
        <ToolbarLayout>
            <ToolbarLink href={aboutHelp.absolutePath} route={aboutHelp} />
            <ToolbarLink href={aboutReleaseNotes.absolutePath} route={aboutReleaseNotes} />
            <ToolbarLink href={aboutAndroid.absolutePath} route={aboutAndroid} />
        </ToolbarLayout>
    );
};

export default Toolbar;
