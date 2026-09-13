import { Component } from "solid-js";

import ListingToolbar from "../../_components/listing/ListingToolbar";

// a list row shows its title as part of the row, so there is no label to toggle
const ListToolbar: Component = () => <ListingToolbar density dim />;

export default ListToolbar;
