import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import { allMapTypes } from '../models/map-type';
import { allMapZoomLevels } from '../models/map-zoom-level';
import { allMargins } from '../models/margin';
import { allPhotoViewModes } from '../models/photo-view-mode';
import { allThumbnailSizes } from '../models/thumbnail-size';
import Toolbar from './Toolbar';
import Panel from './components/Panel';
import MainContent from '../components/layout/MainContent';
import PanelContainer from './components/PanelContainer';
import Select from './components/Select';
import { allSlideshowDurations } from '../models/slideshow-duration';
import { usePhotoPageSettings } from '../contexts/PhotoPageSettingsContext';
import { usePhotoInfoPanelSettings } from '../contexts/PhotoInfoPanelSettingsContext';
import { usePhotoMapViewSettings } from '../contexts/PhotoMapViewSettingsContext';
import RadioGroup from './components/RadioGroup';
import { usePhotoGridViewSettings } from '../contexts/PhotoGridViewSettingsContext';
import { usePhotoDetailViewSettings } from '../contexts/PhotoDetailViewSettingsContext';
import Checkbox from './components/Checkbox';

const ViewPhotos: Component = () => {
    const [pageSettings, { setViewMode, setSlideshowDisplayDurationSeconds }] = usePhotoPageSettings();
    const [detailSettings, { setThumbnailSize: setDetailThumbnailSize }] = usePhotoDetailViewSettings();
    const [gridSettings, { setMargin: setGridMargin, setShowBreadcrumbs: setGridBreadcrumbs, setThumbnailSize: setGridThumbnails }] = usePhotoGridViewSettings();
    const [mapSettings, {setMapType: setMapMapType, setZoom: setMapZoom}] = usePhotoMapViewSettings();
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
    const onChangeGridThumbnail = (evt: Event) => setGridThumbnails(evt.currentTarget.value);

    // detail
    const onChangeDetailThumbnailSize = (evt: Event) => setDetailThumbnailSize(evt.currentTarget.value);
    const onChangeDetailMiniMapZoomLevel = (evt: Event) => setMinimapZoom(evt.currentTarget.value);

    // infopanel
    const onExpandInfoPanelChange = (evt: Event) => setExpandInfoPanel(evt.currentTarget.checked);
    const onChangeShowRatingsPanel = (evt: Event) => setShowRatings(evt.currentTarget.checked);
    const onChangeShowCommentsPanel = (evt: Event) => setShowComments(evt.currentTarget.checked);
    const onChangeShowExifPanel = (evt: Event) => setShowExif(evt.currentTarget.checked);
    const onChangeShowHistogramPanel = (evt: Event) => setShowHistogram(evt.currentTarget.checked);
    const onChangeShowEffectsPanel = (evt: Event) => setShowEffects(evt.currentTarget.checked);
    const onChangeShowMinimapPanel = (evt: Event) => setShowMinimap(evt.currentTarget.checked);
    const onChangeShowMetadataEditorPanel = (evt: Event) => setShowMetadataEditor(evt.currentTarget.checked);
    const onChangeShowCategoryTeaserChooserPanel = (evt: Event) => setShowCategoryTeaserChooser(evt.currentTarget.checked);
    const onChangeInfoPanelMapType = (evt: Event) => setInfoPanelMapType(evt.currentTarget.value);

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
                        <h3 class="mt-4">Show Breadcrumbs</h3>
                        <input type="checkbox" class="toggle" name="detailShowBreadcrumbs" />

                        <h3 class="mt-4">Show Photo List</h3>
                        <input type="checkbox" class="toggle" name="detailShowPhotoList" />

                        <RadioGroup title="Thumbnail Size" groupName='detailThumbnails' itemArray={allThumbnailSizes} selectedValue={detailSettings.thumbnailSizeId} onChange={onChangeDetailThumbnailSize} />

                        <h3 class="mt-4">Info Panel</h3>
                        <div>
                            <Checkbox title="Show Info Panel" name="showInfoPanel" isSelected={infoPanelSettings.expandInfoPanel} onChange={onExpandInfoPanelChange} />
                            <Checkbox title="Show Ratings Panel" name="showRatingsPanel" isSelected={infoPanelSettings.showRatings} onChange={onChangeShowRatingsPanel} />
                            <Checkbox title="Show Comments Panel" name="showCommentsPanel" isSelected={infoPanelSettings.showComments} onChange={onChangeShowCommentsPanel} />
                            <Checkbox title="Show EXIF Panel" name="showExifPanel" isSelected={infoPanelSettings.showExif} onChange={onChangeShowExifPanel} />
                            <Checkbox title="Show Histogram Panel" name="showHistogramPanel" isSelected={infoPanelSettings.showHistogram} onChange={onChangeShowHistogramPanel} />
                            <Checkbox title="Show Effects Panel" name="showEffectsPanel" isSelected={infoPanelSettings.showEffects} onChange={onChangeShowEffectsPanel} />
                            <Checkbox title="Show Mini-map Panel" name="showMiniMapPanel" isSelected={infoPanelSettings.showMinimap} onChange={onChangeShowMinimapPanel} />
                            <Checkbox title="Show Metadata Editor Panel" name="showMetadataEditorPanel" isSelected={infoPanelSettings.showMetadataEditor} onChange={onChangeShowMetadataEditorPanel} />
                            <Checkbox title="Show Category Teaser Chooser Panel" name="showCategoryTeaserChooserPanel" isSelected={infoPanelSettings.showCategoryTeaserChooser} onChange={onChangeShowCategoryTeaserChooserPanel} />
                        </div>

                        <RadioGroup title="Map Type" groupName='detailMapType' itemArray={allMapTypes} selectedValue={infoPanelSettings.minimapMapTypeId} onChange={onChangeInfoPanelMapType} />
                        <Select title="Map Zoom Level" itemArray={allMapZoomLevels} selectedValue={infoPanelSettings.minimapZoomId} onChange={onChangeDetailMiniMapZoomLevel} />
                    </Panel>

                    <Panel title="Grid View">
                        <h3 class="mt-4">Show Breadcrumbs</h3>
                        <input type="checkbox" class="toggle" name="gridShowBreadcrumbs" />

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
