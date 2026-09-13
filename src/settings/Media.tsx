import { Component } from "solid-js";

import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { useMediaInfoPanelSettingsContext } from "../_contexts/settings/MediaInfoPanelSettingsContext";
import { useMediaMapViewSettingsContext } from "../_contexts/settings/MediaMapViewSettingsContext";
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
   Looking at one photograph, rather than at a listing of them. Density, labels,
   badges and face highlighting are the same question everywhere in the
   application and are answered once, under Browsing.
*/
const ViewMedia: Component = () => {
    const [pageSettings, { setView: setViewMode, setSlideshowDisplayDurationSeconds }] =
        useMediaPageSettingsContext();
    const [
        infoPanelSettings,
        {
            setExpandInfoPanel,
            setShowComments,
            setShowExif,
            setShowHistogram,
            setShowEffects,
            setShowMinimap,
            setShowMetadataEditor,
            setShowCategoryTeaserChooser,
            setShowPlaceCovers
        }
    ] = useMediaInfoPanelSettingsContext();
    // one map preference now, shared by the map view and the inspector's minimap
    const [mapSettings, { setMapType, setZoom }] = useMediaMapViewSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Media">
            <PanelContainer>
                <Panel title="Media Page">
                    <RadioGroup
                        title="View"
                        groupName="mediaView"
                        itemArray={allMediaViews}
                        selectedValue={pageSettings.view}
                        onChange={setViewMode}
                    />
                    <Select
                        title="Slideshow Display Duration"
                        itemArray={allSlideshowDurations}
                        selectedValue={pageSettings.slideshowDisplayDurationSeconds}
                        onChange={val => setSlideshowDisplayDurationSeconds(parseInt(val))}
                    />
                </Panel>

                <Panel title="Info Panel">
                    <Toggle
                        title="Show Expanded Panel"
                        name="showInfoPanel"
                        isSelected={infoPanelSettings.expandInfoPanel}
                        onChange={setExpandInfoPanel}
                    />
                    <Checkbox
                        title="Show Comments"
                        name="showCommentsPanel"
                        isSelected={infoPanelSettings.showComments}
                        onChange={setShowComments}
                    />
                    <Checkbox
                        title="Show EXIF"
                        name="showExifPanel"
                        isSelected={infoPanelSettings.showExif}
                        onChange={setShowExif}
                    />
                    <Checkbox
                        title="Show Histogram"
                        name="showHistogramPanel"
                        isSelected={infoPanelSettings.showHistogram}
                        onChange={setShowHistogram}
                    />
                    <Checkbox
                        title="Show Effects"
                        name="showEffectsPanel"
                        isSelected={infoPanelSettings.showEffects}
                        onChange={setShowEffects}
                    />
                    <Checkbox
                        title="Show Mini-map"
                        name="showMiniMapPanel"
                        isSelected={infoPanelSettings.showMinimap}
                        onChange={setShowMinimap}
                    />
                    <Checkbox
                        title="Show Metadata Editor"
                        name="showMetadataEditorPanel"
                        isSelected={infoPanelSettings.showMetadataEditor}
                        onChange={setShowMetadataEditor}
                    />
                    <Checkbox
                        title="Show Category Teaser Chooser"
                        name="showCategoryTeaserPanel"
                        isSelected={infoPanelSettings.showCategoryTeaserChooser}
                        onChange={setShowCategoryTeaserChooser}
                    />
                    <Checkbox
                        title="Show Place Covers"
                        name="showPlaceCoversPanel"
                        isSelected={infoPanelSettings.showPlaceCovers}
                        onChange={setShowPlaceCovers}
                    />
                </Panel>

                <Panel title="Maps">
                    <RadioGroup
                        title="Map Type"
                        groupName="mapType"
                        itemArray={allMapTypes}
                        selectedValue={mapSettings.mapType}
                        onChange={setMapType}
                    />
                    <Select
                        title="Map Zoom Level"
                        itemArray={allMapZoomLevels}
                        selectedValue={mapSettings.zoom}
                        onChange={val => setZoom(parseInt(val))}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewMedia;
