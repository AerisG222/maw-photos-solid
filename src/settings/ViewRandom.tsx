import { Component } from "solid-js";

import { useRandomPageSettingsContext } from '../contexts/settings/RandomPageSettingsContext';
import { useRandomInfoPanelSettingsContext } from '../contexts/settings/RandomInfoPanelSettingsContext';
import { useRandomDetailViewSettingsContext } from '../contexts/settings/RandomDetailViewSettingsContext';
import { useRandomGridViewSettingsContext } from '../contexts/settings/RandomGridViewSettingsContext';
import { allRandomViewModes } from '../_models/PhotoViewMode';
import { allMapZoomLevels } from '../_models/MapZoomLevel';
import { allMapTypes } from '../_models/MapType';
import { allThumbnailSizes } from '../_models/ThumbnailSize';
import { allMargins } from '../_models/Margin';
import { allSlideshowDurations } from '../_models/SlideshowDuration';

import Panel from './components/Panel';
import PanelContainer from './components/PanelContainer';
import Select from './components/Select';
import RadioGroup from './components/RadioGroup';
import Checkbox from './components/Checkbox';
import Toolbar from './Toolbar';
import Toggle from './components/Toggle';
import Layout from '../components/layout/Layout';

const ViewRandom: Component = () => {
    const [pageSettings, { setViewMode, setSlideshowDisplayDurationSeconds }] = useRandomPageSettingsContext();
    const [detailSettings, {
        setShowBreadcrumbs: setDetailShowBreadcrumbs,
        setShowPhotoList: setDetailShowPhotoList,
        setThumbnailSize: setDetailThumbnailSize
    }] = useRandomDetailViewSettingsContext();
    const [gridSettings, {
        setShowBreadcrumbs: setGridShowBreadcrumbs,
        setThumbnailSize: setGridThumbnailSize,
        setMargin: setGridMargin
    }] = useRandomGridViewSettingsContext();
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
        setMinimapMapType
    }] = useRandomInfoPanelSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Settings - Random">
            <PanelContainer>
                <Panel title="Random Page">
                    <RadioGroup title="View Mode" groupName='pageViewMode' itemArray={allRandomViewModes} selectedValue={pageSettings.viewMode} onChange={setViewMode} />
                    <Select title="Slideshow Display Duration" itemArray={allSlideshowDurations} selectedValue={pageSettings.slideshowDisplayDurationSeconds} onChange={val => setSlideshowDisplayDurationSeconds(parseInt(val))} />
                </Panel>

                <Panel title="Detail View">
                    <Toggle title="Show Breadcrumbs" name="detailShowBreadcrumbs" isSelected={detailSettings.showBreadcrumbs} onChange={setDetailShowBreadcrumbs} />
                    <Toggle title="Show Photo List" name="detailShowPhotoList" isSelected={detailSettings.showPhotoList} onChange={setDetailShowPhotoList} />
                    <RadioGroup title="Thumbnail Size" groupName='detailThumbnails' itemArray={allThumbnailSizes} selectedValue={detailSettings.thumbnailSize} onChange={setDetailThumbnailSize} />

                    <h3 class="mt-4">Info Panel</h3>
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

                    <RadioGroup title="Map Type" groupName='detailMapType' itemArray={allMapTypes} selectedValue={infoPanelSettings.minimapMapType} onChange={setMinimapMapType} />
                    <Select title="Map Zoom Level" itemArray={allMapZoomLevels} selectedValue={infoPanelSettings.minimapZoom} onChange={val => setMinimapZoom(parseInt(val))} />
                </Panel>

                <Panel title="GridView">
                    <Toggle title="Show Breadcrumbs" name="gridShowBreadcrumbs" isSelected={gridSettings.showBreadcrumbs} onChange={setGridShowBreadcrumbs} />
                    <RadioGroup title="Margins" groupName='gridMargin' itemArray={allMargins} selectedValue={gridSettings.marginId} onChange={setGridMargin} />
                    <RadioGroup title="Thumbnail Size" groupName='gridThumbnails' itemArray={allThumbnailSizes} selectedValue={gridSettings.thumbnailSize} onChange={setGridThumbnailSize} />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewRandom;
