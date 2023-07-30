import { Component } from "solid-js";

import { usePhotoPageSettingsContext } from '../contexts/settings/PhotoPageSettingsContext';
import { usePhotoGridViewSettingsContext } from '../contexts/settings/PhotoGridViewSettingsContext';
import { usePhotoDetailViewSettingsContext } from '../contexts/settings/PhotoDetailViewSettingsContext';
import { usePhotoInfoPanelSettingsContext } from '../contexts/settings/PhotoInfoPanelSettingsContext';
import { usePhotoMapViewSettingsContext } from '../contexts/settings/PhotoMapViewSettingsContext';
import { allMapTypes } from '../_models/MapType';
import { allMapZoomLevels } from '../_models/MapZoomLevel';
import { allMargins } from '../_models/Margin';
import { allPhotoViewModes } from '../_models/PhotoViewMode';
import { allThumbnailSizes } from '../_models/ThumbnailSize';
import { allSlideshowDurations } from '../_models/SlideshowDuration';

import Panel from './components/Panel';
import PanelContainer from './components/PanelContainer';
import Select from './components/Select';
import RadioGroup from './components/RadioGroup';
import Checkbox from './components/Checkbox';
import Toolbar from './Toolbar';
import Toggle from './components/Toggle';
import Layout from '../components/layout/Layout';

const ViewMedia: Component = () => {
    const [pageSettings, { setViewMode, setSlideshowDisplayDurationSeconds }] = usePhotoPageSettingsContext();
    const [mapSettings, {setMapType: setMapMapType, setZoom: setMapZoom}] = usePhotoMapViewSettingsContext();
    const [detailSettings, {
        setShowBreadcrumbs: setDetailShowBreadcrumbs,
        setShowPhotoList: setDetailShowPhotoList,
        setThumbnailSize: setDetailThumbnailSize
    }] = usePhotoDetailViewSettingsContext();
    const [gridSettings, {
        setMargin: setGridMargin,
        setShowBreadcrumbs: setGridShowBreadcrumbs,
        setThumbnailSize: setGridThumbnailSize
    }] = usePhotoGridViewSettingsContext();
    const [infoPanelSettings, {
        setExpandInfoPanel,
        setShowRatings,
        setShowCategoryTeaserChooser,
        setShowComments,
        setShowExif,
        setShowEffects,
        setShowMetadataEditor,
        setShowHistogram,
        setShowMinimap,
        setMinimapZoom,
        setMinimapMapType: setInfoPanelMapType
    }] = usePhotoInfoPanelSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Media">
            <PanelContainer>
                <Panel title="Media Page">
                    <RadioGroup title="View" groupName='pageView' itemArray={allPhotoViewModes} selectedValue={pageSettings.viewMode} onChange={setViewMode} />
                    <Select title="Slideshow Display Duration" itemArray={allSlideshowDurations} selectedValue={pageSettings.slideshowDisplayDurationSeconds} onChange={val => setSlideshowDisplayDurationSeconds(parseInt(val))} />
                </Panel>

                <Panel title="Detail View">
                    <Toggle title="Show Breadcrumbs" name="detailShowBreadcrumbs" isSelected={detailSettings.showBreadcrumbs} onChange={setDetailShowBreadcrumbs} />
                    <Toggle title="Show Photo List" name="detailShowPhotoList" isSelected={detailSettings.showPhotoList} onChange={setDetailShowPhotoList} />
                    <RadioGroup title="Thumbnail Size" groupName='detailThumbnails' itemArray={allThumbnailSizes} selectedValue={detailSettings.thumbnailSize} onChange={setDetailThumbnailSize} />

                    <h3 class="mt-4 color-secondary">Info Panel</h3>
                    <div>
                        <Checkbox title="Show Info Panel" name="showInfoPanel" isSelected={infoPanelSettings.expandInfoPanel} onChange={setExpandInfoPanel} />
                        <Checkbox title="Show Ratings Panel" name="showRatingsPanel" isSelected={infoPanelSettings.showRatings} onChange={setShowRatings} />
                        <Checkbox title="Show Comments Panel" name="showCommentsPanel" isSelected={infoPanelSettings.showComments} onChange={setShowComments} />
                        <Checkbox title="Show EXIF Panel" name="showExifPanel" isSelected={infoPanelSettings.showExif} onChange={setShowExif} />
                        <Checkbox title="Show Histogram Panel" name="showHistogramPanel" isSelected={infoPanelSettings.showHistogram} onChange={setShowHistogram} />
                        <Checkbox title="Show Effects Panel" name="showEffectsPanel" isSelected={infoPanelSettings.showEffects} onChange={setShowEffects} />
                        <Checkbox title="Show Mini-map Panel" name="showMiniMapPanel" isSelected={infoPanelSettings.showMinimap} onChange={setShowMinimap} />
                        <Checkbox title="Show Metadata Editor Panel" name="showMetadataEditorPanel" isSelected={infoPanelSettings.showMetadataEditor} onChange={setShowMetadataEditor} />
                        <Checkbox title="Show Category Teaser Chooser Panel" name="showCategoryTeaserChooserPanel" isSelected={infoPanelSettings.showCategoryTeaserChooser} onChange={setShowCategoryTeaserChooser} />
                    </div>

                    <RadioGroup title="Map Type" groupName='detailMapType' itemArray={allMapTypes} selectedValue={infoPanelSettings.minimapMapType} onChange={setInfoPanelMapType} />
                    <Select title="Map Zoom Level" itemArray={allMapZoomLevels} selectedValue={infoPanelSettings.minimapZoom} onChange={val => setMinimapZoom(parseInt(val))} />
                </Panel>

                <Panel title="Grid View">
                    <Toggle title="Show Breadcrumbs" name="gridShowBreadcrumbs" isSelected={gridSettings.showBreadcrumbs} onChange={setGridShowBreadcrumbs} />
                    <RadioGroup title="Margins" groupName='gridMargin' itemArray={allMargins} selectedValue={gridSettings.margin} onChange={setGridMargin} />
                    <RadioGroup title="Thumbnail Size" groupName='gridThumbnails' itemArray={allThumbnailSizes} selectedValue={gridSettings.thumbnailSize} onChange={setGridThumbnailSize} />
                </Panel>

                <Panel title="Map View">
                    <RadioGroup title="Map Type" groupName='mapMapType' itemArray={allMapTypes} selectedValue={mapSettings.mapType} onChange={setMapMapType} />
                    <Select title="Map Zoom Level" itemArray={allMapZoomLevels} selectedValue={mapSettings.zoom} onChange={val => setMapZoom(parseInt(val))} />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewMedia;
