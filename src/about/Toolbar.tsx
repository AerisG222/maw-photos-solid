import { Component } from "solid-js";

import { aboutAndroid, aboutHelp, aboutReleaseNotes } from "./_routes";

import ToolbarLayout from "../_components/toolbar/ToolbarLayout";
import ToolbarLink from "../_components/toolbar/ToolbarLink";

const Toolbar: Component = () => {
    return (
        <ToolbarLayout>
            <ToolbarLink route={aboutHelp} />
            <ToolbarLink route={aboutReleaseNotes} />
            <ToolbarLink route={aboutAndroid} />
        </ToolbarLayout>
    );
};

export default Toolbar;
