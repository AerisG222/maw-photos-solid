import { Component } from "solid-js";

import ListingToolbar from "../../_components/listing/ListingToolbar";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

/*
   No badges: a person is favorited from the heart on their own tile, which is
   always shown because it is the only way to do it.
*/
const Toolbar: Component = () => (
    <ToolbarLayout>
        <ListingToolbar sort labels />
    </ToolbarLayout>
);

export default Toolbar;
