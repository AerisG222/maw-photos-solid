import { Component } from "solid-js";

import { usePhotoPageSettings } from '../contexts/PhotoPageSettingsContext';
import { usePhotoGridViewSettings } from '../contexts/PhotoGridViewSettingsContext';
import { usePhotoDetailViewSettings } from '../contexts/PhotoDetailViewSettingsContext';
import { usePhotoInfoPanelSettings } from '../contexts/PhotoInfoPanelSettingsContext';
import { usePhotoMapViewSettings } from '../contexts/PhotoMapViewSettingsContext';
import { allMapTypes } from '../models/map-type';
import { allMapZoomLevels } from '../models/map-zoom-level';
import { allMargins } from '../models/margin';
import { allPhotoViewModes } from '../models/photo-view-mode';
import { allThumbnailSizes } from '../models/thumbnail-size';
import { allSlideshowDurations } from '../models/slideshow-duration';

import Panel from './components/Panel';
import MainContent from '../components/layout/MainContent';
import ContentLayout from '../components/layout/ContentLayout';
import PanelContainer from './components/PanelContainer';
import Select from './components/Select';
import RadioGroup from './components/RadioGroup';
import Checkbox from './components/Checkbox';
import Toolbar from './Toolbar';
import Toggle from './components/Toggle';

const ViewPhotos: Component = () => {
    const [pageSettings, { setViewMode, setSlideshowDisplayDurationSeconds }] = usePhotoPageSettings();
    const [mapSettings, {setMapType: setMapMapType, setZoom: setMapZoom}] = usePhotoMapViewSettings();
    const [detailSettings, {
        setShowBreadcrumbs: setDetailShowBreadcrumbs,
        setShowPhotoList: setDetailShowPhotoList,
        setThumbnailSize: setDetailThumbnailSize
    }] = usePhotoDetailViewSettings();
    const [gridSettings, {
        setMargin: setGridMargin,
        setShowBreadcrumbs: setGridShowBreadcrumbs,
        setThumbnailSize: setGridThumbnailSize
    }] = usePhotoGridViewSettings();
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
    }] = usePhotoInfoPanelSettings();

    // page
    const onPageViewChange = (evt: Event) => setViewMode(evt.currentTarget.value);
    const onChangeSlideshowDuration = (evt: Event) => setSlideshowDisplayDurationSeconds(evt.currentTarget.value);

    // grid
    const onChangeGridMargin = (evt: Event) => setGridMargin(evt.currentTarget.value);
    const onChangeGridThumbnail = (evt: Event) => setGridThumbnailSize(evt.currentTarget.value);

    // detail
    const onChangeDetailThumbnailSize = (evt: Event) => setDetailThumbnailSize(evt.currentTarget.value);
    const onChangeDetailMiniMapZoomLevel = (evt: Event) => setMinimapZoom(evt.currentTarget.value);
    const onChangeDetailMapType = (evt: Event) => setInfoPanelMapType(evt.currentTarget.value);

    // map
    const onChangeMapPageZoomLevel = (evt: Event) => setMapZoom(parseInt(evt.currentTarget.value));
    const onChangeMapMapType = (evt: Event) => setMapMapType(evt.currentTarget.value);

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Photos">
                <PanelContainer>
                    <Panel title="Photo Category Page">
                        <RadioGroup title="View" groupName='pageView' itemArray={allPhotoViewModes} selectedValue={pageSettings.viewModeId} onChange={onPageViewChange} />
                        <Select title="Slideshow Display Duration" itemArray={allSlideshowDurations} selectedValue={pageSettings.slideshowDisplayDurationSeconds} onChange={onChangeSlideshowDuration} />
                    </Panel>

                    <Panel title="Detail View">
                        <Toggle title="Show Breadcrumbs" name="detailShowBreadcrumbs" isSelected={detailSettings.showBreadcrumbs} onChange={setDetailShowBreadcrumbs} />
                        <Toggle title="Show Photo List" name="detailShowPhotoList" isSelected={detailSettings.showPhotoList} onChange={setDetailShowPhotoList} />
                        <RadioGroup title="Thumbnail Size" groupName='detailThumbnails' itemArray={allThumbnailSizes} selectedValue={detailSettings.thumbnailSizeId} onChange={onChangeDetailThumbnailSize} />

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

                        <RadioGroup title="Map Type" groupName='detailMapType' itemArray={allMapTypes} selectedValue={infoPanelSettings.minimapMapTypeId} onChange={onChangeDetailMapType} />
                        <Select title="Map Zoom Level" itemArray={allMapZoomLevels} selectedValue={infoPanelSettings.minimapZoomId} onChange={onChangeDetailMiniMapZoomLevel} />
                    </Panel>

                    <Panel title="Grid View">
                        <Toggle title="Show Breadcrumbs" name="gridShowBreadcrumbs" isSelected={gridSettings.showBreadcrumbs} onChange={setGridShowBreadcrumbs} />
                        <RadioGroup title="Margins" groupName='gridMargin' itemArray={allMargins} selectedValue={gridSettings.marginId} onChange={onChangeGridMargin} />
                        <RadioGroup title="Thumbnail Size" groupName='gridThumbnails' itemArray={allThumbnailSizes} selectedValue={gridSettings.thumbnailSizeId} onChange={onChangeGridThumbnail} />
                    </Panel>

                    <Panel title="Map View">
                        <RadioGroup title="Map Type" groupName='mapMapType' itemArray={allMapTypes} selectedValue={mapSettings.mapTypeId} onChange={onChangeMapMapType} />
                        <Select title="Map Zoom Level" itemArray={allMapZoomLevels} selectedValue={mapSettings.zoomId} onChange={onChangeMapPageZoomLevel} />
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewPhotos;
