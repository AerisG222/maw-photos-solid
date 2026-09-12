import { Component } from "solid-js";

import { useFaceFeedSettingsContext } from "../_contexts/settings/FaceFeedSettingsContext";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import Toggle from "../_components/input/Toggle";
import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";

/*
   Only what is particular to this area - see the note in Categories. How the
   people grid and a feed's categories present their items is answered once,
   under Browsing, along with the order people are listed in.
*/
const ViewPeople: Component = () => {
    const [feedSettings, { setFavoritesOnly, setShuffle, setShowCategories }] =
        useFaceFeedSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="People">
            <PanelContainer>
                {/*
                    What a person's or clan's address opens on, when it is
                    opened without one of its own.
                */}
                <Panel title="Person & Clan Media">
                    <Toggle
                        title="Show Favorites Only"
                        name="feedFavoritesOnly"
                        isSelected={feedSettings.favoritesOnly}
                        onChange={setFavoritesOnly}
                    />
                    <Toggle
                        title="Shuffle Media"
                        name="feedShuffle"
                        isSelected={feedSettings.shuffle}
                        onChange={setShuffle}
                    />
                    <Toggle
                        title="Open on Categories"
                        name="feedShowCategories"
                        isSelected={feedSettings.showCategories}
                        onChange={setShowCategories}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewPeople;
