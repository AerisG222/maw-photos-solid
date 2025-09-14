import { Component } from "solid-js";

import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { useMediaInfoPanelSettingsContext } from "../_contexts/settings/MediaInfoPanelSettingsContext";
import { useMediaMapViewSettingsContext } from "../_contexts/settings/MediaMapViewSettingsContext";
import { allMapTypes } from "../_models/MapType";
import { allMapZoomLevels } from "../_models/MapZoomLevel";
import { allMargins } from "../_models/Margin";
import { allMediaViews } from "../_models/MediaView";
import { allThumbnailSizes } from "../_models/ThumbnailSize";
import { allSlideshowDurations } from "../_models/SlideshowDuration";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import Select from "../_components/input/Select";
import RadioGroup from "../_components/input/RadioGroup";
import Checkbox from "../_components/input/Checkbox";
import Toolbar from "./components/Toolbar";
import Toggle from "../_components/input/Toggle";
import Layout from "../_components/layout/Layout";

const ViewMedia: Component = () => {
    const [pageSettings, { setView: setViewMode, setSlideshowDisplayDurationSeconds }] =
        useMediaPageSettingsContext();
    const [mapSettings, { setMapType: setMapMapType, setZoom: setMapZoom }] =
        useMediaMapViewSettingsContext();
    const [
        detailSettings,
        {
            setShowBreadcrumbs: setDetailShowBreadcrumbs,
            setShowMediaList: setDetailShowMediaList,
            setThumbnailSize: setDetailThumbnailSize,
            setDimThumbnails: setDetailDimThumbnails,
            setShowFavoritesBadge: setDetailShowFavoritesBadge
        }
    ] = useMediaDetailViewSettingsContext();
    const [fullscreenSettings, { setShowFavoritesBadge: setFullscreenShowFavoritesBadge }] =
        useMediaGridViewSettingsContext();
    const [
        gridSettings,
        {
            setMargin: setGridMargin,
            setShowBreadcrumbs: setGridShowBreadcrumbs,
            setThumbnailSize: setGridThumbnailSize,
            setDimThumbnails: setGridDimThumbnails,
            setShowFavoritesBadge: setGridShowFavoritesBadge
        }
    ] = useMediaGridViewSettingsContext();
    const [
        infoPanelSettings,
        {
            setExpandInfoPanel,
            setShowCategoryTeaserChooser,
            setShowComments,
            setShowExif,
            setShowEffects,
            setShowMetadataEditor,
            setShowHistogram,
            setShowMinimap,
            setMinimapZoom,
            setMinimapMapType: setInfoPanelMapType
        }
    ] = useMediaInfoPanelSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Media">
            <PanelContainer>
                <Panel title="Media Page">
                    <RadioGroup
                        title="View"
                        groupName="pageView"
                        itemArray={allMediaViews}
                        selectedValue={pageSettings.view}
                        onChange={setViewMode}
                    />
                    <Select
                        horizontal={false}
                        title="Slideshow Display Duration"
                        itemArray={allSlideshowDurations}
                        selectedValue={pageSettings.slideshowDisplayDurationSeconds}
                        onChange={val => setSlideshowDisplayDurationSeconds(parseInt(val))}
                    />
                </Panel>

                <Panel title="Detail View">
                    <Toggle
                        title="Show Breadcrumbs"
                        name="detailShowBreadcrumbs"
                        isSelected={detailSettings.showBreadcrumbs}
                        onChange={setDetailShowBreadcrumbs}
                    />
                    <Toggle
                        title="Show Media List"
                        name="detailShowMediaList"
                        isSelected={detailSettings.showMediaList}
                        onChange={setDetailShowMediaList}
                    />
                    <RadioGroup
                        title="Thumbnail Size"
                        groupName="detailThumbnails"
                        itemArray={allThumbnailSizes}
                        selectedValue={detailSettings.thumbnailSize}
                        onChange={setDetailThumbnailSize}
                    />
                    <Toggle
                        title="Dim Thumbnails"
                        name="detailDimThumbnails"
                        isSelected={detailSettings.dimThumbnails}
                        onChange={setDetailDimThumbnails}
                    />
                    <Toggle
                        title="Show Favorite Badges"
                        name="detailShowFavoriteBadges"
                        isSelected={detailSettings.showFavoritesBadge}
                        onChange={setDetailShowFavoritesBadge}
                    />

                    <h3 class="head3 mt-4 text-secondary">Info Panel</h3>
                    <div>
                        <Checkbox
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
                            name="showCategoryTeaserChooserPanel"
                            isSelected={infoPanelSettings.showCategoryTeaserChooser}
                            onChange={setShowCategoryTeaserChooser}
                        />
                    </div>

                    <RadioGroup
                        title="Map Type"
                        groupName="detailMapType"
                        itemArray={allMapTypes}
                        selectedValue={infoPanelSettings.minimapMapType}
                        onChange={setInfoPanelMapType}
                    />
                    <Select
                        horizontal={false}
                        title="Map Zoom Level"
                        itemArray={allMapZoomLevels}
                        selectedValue={infoPanelSettings.minimapZoom}
                        onChange={val => setMinimapZoom(parseInt(val))}
                    />
                </Panel>

                <Panel title="Fullscreen View">
                    <Toggle
                        title="Show Favorite Badges"
                        name="fullscreenShowFavoriteBadges"
                        isSelected={fullscreenSettings.showFavoritesBadge}
                        onChange={setFullscreenShowFavoritesBadge}
                    />
                </Panel>

                <Panel title="Grid View">
                    <Toggle
                        title="Show Breadcrumbs"
                        name="gridShowBreadcrumbs"
                        isSelected={gridSettings.showBreadcrumbs}
                        onChange={setGridShowBreadcrumbs}
                    />
                    <RadioGroup
                        title="Margins"
                        groupName="gridMargin"
                        itemArray={allMargins}
                        selectedValue={gridSettings.margin}
                        onChange={setGridMargin}
                    />
                    <RadioGroup
                        title="Thumbnail Size"
                        groupName="gridThumbnails"
                        itemArray={allThumbnailSizes}
                        selectedValue={gridSettings.thumbnailSize}
                        onChange={setGridThumbnailSize}
                    />
                    <Toggle
                        title="Dim Thumbnails"
                        name="gridDimThumbnails"
                        isSelected={gridSettings.dimThumbnails}
                        onChange={setGridDimThumbnails}
                    />
                    <Toggle
                        title="Show Favorite Badges"
                        name="gridShowFavoriteBadges"
                        isSelected={gridSettings.showFavoritesBadge}
                        onChange={setGridShowFavoritesBadge}
                    />
                </Panel>

                <Panel title="Map View">
                    <RadioGroup
                        title="Map Type"
                        groupName="mapMapType"
                        itemArray={allMapTypes}
                        selectedValue={mapSettings.mapType}
                        onChange={setMapMapType}
                    />
                    <Select
                        horizontal={false}
                        title="Map Zoom Level"
                        itemArray={allMapZoomLevels}
                        selectedValue={mapSettings.zoom}
                        onChange={val => setMapZoom(parseInt(val))}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewMedia;
