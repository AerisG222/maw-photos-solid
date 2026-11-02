import { Component } from "solid-js";

import { useAreaSettingsContext } from "../_contexts/settings/AreaSettingsContext";

import Checkbox from "../_components/input/Checkbox";
import MediaFilterOptions from "../_components/filters/MediaFilterOptions";
import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import Toggle from "../_components/input/Toggle";
import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";

/*
   Only what is particular to this area - see Categories. How the people grid and
   a feed's categories present their items is answered under Browsing, along with
   the order people are listed in.
*/
const ViewPeople: Component = () => {
    const [area, { setFeedListing, setPeopleFavoritesOnly, setFeedFilters }] =
        useAreaSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="People">
            <PanelContainer>
                {/*
                    What a person's or clan's address opens on, when it is opened
                    without one of its own.
                */}
                <Panel title="Person & Clan Media">
                    <Toggle
                        title="Open on Categories"
                        name="feedShowCategories"
                        isSelected={area.feedListing === "categories"}
                        onChange={show => setFeedListing(show ? "categories" : "media")}
                    />
                </Panel>

                <Panel title="People Filters">
                    <Checkbox
                        title="Favorites"
                        name="people-favorites"
                        isSelected={area.peopleFavoritesOnly}
                        onChange={setPeopleFavoritesOnly}
                    />
                </Panel>

                <Panel title="Person, Clan & Place Filters">
                    <MediaFilterOptions
                        filters={area.feedFilters}
                        onChange={changes => setFeedFilters({ ...area.feedFilters, ...changes })}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewPeople;
