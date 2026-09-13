import { Component } from "solid-js";

import { useAreaSettingsContext } from "../_contexts/settings/AreaSettingsContext";

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
    const [area, { setFeedFavoritesOnly, setFeedShuffle, setFeedListing }] =
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
                        title="Show Favorites Only"
                        name="feedFavoritesOnly"
                        isSelected={area.feedFavoritesOnly}
                        onChange={setFeedFavoritesOnly}
                    />
                    <Toggle
                        title="Shuffle Media"
                        name="feedShuffle"
                        isSelected={area.feedShuffle}
                        onChange={setFeedShuffle}
                    />
                    <Toggle
                        title="Open on Categories"
                        name="feedShowCategories"
                        isSelected={area.feedListing === "categories"}
                        onChange={show => setFeedListing(show ? "categories" : "media")}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewPeople;
