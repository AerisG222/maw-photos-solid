import { Component } from "solid-js";

import ListingToolbar from "../../_components/listing/ListingToolbar";
import BrowseToggle from "./BrowseToggle";

const GridToolbar: Component = () => (
    <>
        <BrowseToggle />
        <ListingToolbar labels />
    </>
);

export default GridToolbar;
