import { Component } from "solid-js";

import { useAreaSettingsContext } from "../_contexts/settings/AreaSettingsContext";
import { useListingSettingsContext } from "../_contexts/settings/ListingSettingsContext";

import MediaFilterOptions from "../_components/filters/MediaFilterOptions";
import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import Toggle from "../_components/input/Toggle";
import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";

const ViewPlaces: Component = () => {
    const [area, { setPlaceFeedListing, setPlaceFeedFilters }] = useAreaSettingsContext();
    const [listing, { setShowLabels }] = useListingSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Places">
            <PanelContainer>
                <Panel title="Places Page">
                    <Toggle
                        title="Show Labels"
                        name="placeLabels"
                        isSelected={listing.labels.places}
                        onChange={show => setShowLabels("places", show)}
                    />
                </Panel>

                {/*
                    What a place's media opens on, when it is opened without an
                    address of its own, and how its categories are drawn.
                */}
                <Panel title="Place Media">
                    <Toggle
                        title="Open on Categories"
                        name="placeFeedShowCategories"
                        isSelected={area.placeFeedListing === "categories"}
                        onChange={show => setPlaceFeedListing(show ? "categories" : "media")}
                    />
                    <Toggle
                        title="Show Labels on Categories"
                        name="placeFeedLabels"
                        isSelected={listing.labels.placeFeeds}
                        onChange={show => setShowLabels("placeFeeds", show)}
                    />
                </Panel>

                <Panel title="Place Filters">
                    <MediaFilterOptions
                        filters={area.placeFeedFilters}
                        onChange={changes =>
                            setPlaceFeedFilters({ ...area.placeFeedFilters, ...changes })
                        }
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewPlaces;
