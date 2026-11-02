import { Component } from "solid-js";

import { useAreaSettingsContext } from "../_contexts/settings/AreaSettingsContext";
import { useListingSettingsContext } from "../_contexts/settings/ListingSettingsContext";
import { allPersonSorts } from "../_models/PersonSort";

import Checkbox from "../_components/input/Checkbox";
import MediaFilterOptions from "../_components/filters/MediaFilterOptions";
import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../_components/input/RadioGroup";
import Toggle from "../_components/input/Toggle";
import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";

const ViewPeople: Component = () => {
    const [
        area,
        { setPersonFeedListing, setPersonFeedShuffle, setPeopleFavoritesOnly, setPersonFeedFilters }
    ] = useAreaSettingsContext();
    const [listing, { setShowLabels, setPeopleSort }] = useListingSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="People">
            <PanelContainer>
                <Panel title="People Page">
                    <RadioGroup
                        title="Sort By"
                        groupName="peopleSort"
                        itemArray={allPersonSorts}
                        selectedValue={listing.peopleSort}
                        onChange={setPeopleSort}
                    />
                    <Toggle
                        title="Show Labels"
                        name="peopleLabels"
                        isSelected={listing.labels.people}
                        onChange={show => setShowLabels("people", show)}
                    />
                </Panel>

                {/*
                    What a person's or clan's address opens on, when it is opened
                    without one of its own, and how its categories are drawn.
                */}
                <Panel title="Person & Clan Media">
                    <Toggle
                        title="Open on Categories"
                        name="feedShowCategories"
                        isSelected={area.personFeedListing === "categories"}
                        onChange={show => setPersonFeedListing(show ? "categories" : "media")}
                    />
                    <Toggle
                        title="Shuffle Media"
                        name="feedShuffle"
                        isSelected={area.personFeedShuffle}
                        onChange={setPersonFeedShuffle}
                    />
                    <Toggle
                        title="Show Labels on Categories"
                        name="feedLabels"
                        isSelected={listing.labels.personFeeds}
                        onChange={show => setShowLabels("personFeeds", show)}
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

                <Panel title="Person & Clan Filters">
                    <MediaFilterOptions
                        filters={area.personFeedFilters}
                        onChange={changes =>
                            setPersonFeedFilters({ ...area.personFeedFilters, ...changes })
                        }
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewPeople;
