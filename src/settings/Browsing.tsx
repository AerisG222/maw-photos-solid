import { Component } from "solid-js";

import { useListingSettingsContext } from "../_contexts/settings/ListingSettingsContext";
import { allDensities } from "../_models/Density";
import { allPersonSorts } from "../_models/PersonSort";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../_components/input/RadioGroup";
import Toggle from "../_components/input/Toggle";
import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";

/*
   Everything about how a listing presents its items, in one place.

   These used to be repeated on the Categories, Media, People and Search pages -
   the same four controls, four times over, each writing to a different store,
   so setting them in one place did nothing for the others. They are one setting
   each now, and this is where they live.
*/
const ViewBrowsing: Component = () => {
    const [
        settings,
        {
            setDensity,
            setShowLabels,
            setShowBadges,
            setDimThumbnails,
            setHighlightFaces,
            setPeopleSort
        }
    ] = useListingSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Browsing">
            <PanelContainer>
                <Panel title="Every Listing">
                    <RadioGroup
                        title="Density"
                        groupName="density"
                        itemArray={allDensities}
                        selectedValue={settings.density}
                        onChange={setDensity}
                    />
                    <Toggle
                        title="Show Labels"
                        name="showLabels"
                        isSelected={settings.showLabels}
                        onChange={setShowLabels}
                    />
                    <Toggle
                        title="Show Badges"
                        name="showBadges"
                        isSelected={settings.showBadges}
                        onChange={setShowBadges}
                    />
                    <Toggle
                        title="Dim Thumbnails"
                        name="dimThumbnails"
                        isSelected={settings.dimThumbnails}
                        onChange={setDimThumbnails}
                    />
                    <Toggle
                        title="Highlight Faces"
                        name="highlightFaces"
                        isSelected={settings.highlightFaces}
                        onChange={setHighlightFaces}
                    />
                </Panel>

                <Panel title="People">
                    <RadioGroup
                        title="Sort By"
                        groupName="peopleSort"
                        itemArray={allPersonSorts}
                        selectedValue={settings.peopleSort}
                        onChange={setPeopleSort}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewBrowsing;
