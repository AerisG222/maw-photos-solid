import { ParentComponent } from "solid-js";

import { settingsCategories, settingsMedia, settingsSearch } from "./_routes";

import ToolbarLayout from "../components/toolbar/ToolbarLayout";
import ToolbarLink from "../components/toolbar/ToolbarLink";

const Toolbar: ParentComponent = () => {
    return (
        <ToolbarLayout>
            <ToolbarLink route={settingsCategories} />
            <ToolbarLink route={settingsMedia} />
            <ToolbarLink route={settingsSearch} />
        </ToolbarLayout>
    );
};

export default Toolbar;
