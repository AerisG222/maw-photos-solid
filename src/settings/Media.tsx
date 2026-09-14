import { Component, For } from "solid-js";

import { useMediaSettingsContext } from "../_contexts/settings/MediaSettingsContext";
import { inspectorCards } from "../_components/inspector/registry";
import { allMapTypes } from "../_models/MapType";
import { allMapZoomLevels } from "../_models/MapZoomLevel";
import { allMediaViews } from "../_models/MediaView";
import { allSlideshowDurations } from "../_models/SlideshowDuration";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import Select from "../_components/input/Select";
import RadioGroup from "../_components/input/RadioGroup";
import Checkbox from "../_components/input/Checkbox";
import Toolbar from "./components/Toolbar";
import Toggle from "../_components/input/Toggle";
import Layout from "../_components/layout/Layout";

/*
   Looking at one photograph, rather than at a listing of them. Labels,
   badges and face highlighting are the same question everywhere and are answered
   once, under Browsing.

   The inspector's cards come from the registry rather than being listed again
   here. There were eight checkboxes naming eight cards, which is eight chances
   for this page and the panel to disagree about what exists.
*/
const ViewMedia: Component = () => {
    const [
        settings,
        {
            setView,
            setSlideshowSeconds,
            setInspectorOpen,
            toggleInspectorCard,
            setMapType,
            setMapZoom
        }
    ] = useMediaSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Media">
            <PanelContainer>
                <Panel title="Media Page">
                    <RadioGroup
                        title="View"
                        groupName="mediaView"
                        itemArray={allMediaViews}
                        selectedValue={settings.view}
                        onChange={setView}
                    />
                    <Select
                        title="Slideshow Display Duration"
                        itemArray={allSlideshowDurations}
                        selectedValue={settings.slideshowSeconds}
                        onChange={val => setSlideshowSeconds(parseInt(val))}
                    />
                </Panel>

                <Panel title="Inspector">
                    <Toggle
                        title="Show Expanded Panel"
                        name="inspectorOpen"
                        isSelected={settings.inspectorOpen}
                        onChange={setInspectorOpen}
                    />

                    <For each={inspectorCards}>
                        {card => (
                            <Checkbox
                                title={card.title}
                                name={`inspector-${card.id}`}
                                isSelected={settings.inspectorCards.includes(card.id)}
                                onChange={() => toggleInspectorCard(card.id)}
                            />
                        )}
                    </For>
                </Panel>

                {/* one map preference, read by the map view and by the minimap card */}
                <Panel title="Maps">
                    <RadioGroup
                        title="Map Type"
                        groupName="mapType"
                        itemArray={allMapTypes}
                        selectedValue={settings.mapType}
                        onChange={setMapType}
                    />
                    <Select
                        title="Map Zoom Level"
                        itemArray={allMapZoomLevels}
                        selectedValue={settings.mapZoom}
                        onChange={val => setMapZoom(parseInt(val))}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewMedia;
