import { ParentComponent } from "solid-js";

import { settingsCategories, settingsMedia, settingsSearch } from "./_routes";

import ToolbarLayout from "../_components/toolbar/ToolbarLayout";
import ToolbarLink from "../_components/toolbar/ToolbarLink";

const Toolbar: ParentComponent = () => {
    return (
        <ToolbarLayout>
            <ToolbarLink href={settingsCategories.absolutePath} route={settingsCategories} />
            <ToolbarLink href={settingsMedia.absolutePath} route={settingsMedia} />
            <ToolbarLink href={settingsSearch.absolutePath} route={settingsSearch} />
        </ToolbarLayout>
    );
};

export default Toolbar;
