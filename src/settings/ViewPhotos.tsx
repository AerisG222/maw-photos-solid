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

const ViewPhotos: Component = () => {
    const [pageSettings, { setViewMode, setSlideshowDisplayDurationSeconds }] = usePhotoPageSettings();
    const [detailSettings, { setThumbnailSize: setDetailThumbnailSize }] = usePhotoDetailViewSettings();
    const [gridSettings, { setMargin: setGridMargin, setShowBreadcrumbs: setGridBreadcrumbs, setThumbnailSize: setGridThumbnails }] = usePhotoGridViewSettings();
    const [mapSettings, {setMapType: setMapMapType, setZoom: setMapZoom}] = usePhotoMapViewSettings();
    const [infoPanelSettings, {
        setShowRatings,
        setShowCategoryTeaserChooser,
        setShowComments,
        setShowExif,
        setShowEffects,
        setShowMetadataEditor,
        setShowHistogram,
        setShowMinimap,
        setExpandedState,
        setMinimapZoom,
        setMinimapMapType: setInfoPanelMapType
    }] = usePhotoInfoPanelSettings();

    const onPageViewChange = (evt: Event) => {
        evt.preventDefault();
        setViewMode(evt.currentTarget.value);
    }

    const onChangeSlideshowDuration = (evt: Event) => {
        evt.preventDefault();
        setSlideshowDisplayDurationSeconds(evt.currentTarget.value);
    };

    const onChangeDetailThumbnailSize = (evt: Event) => {
        evt.preventDefault();
        setDetailThumbnailSize(evt.currentTarget.value);
    }

    const onChangeDetailMiniMapZoomLevel = (evt: Event) => {
        evt.preventDefault();
        setMinimapZoom(evt.currentTarget.value);
    };

    const onChangeInfoPanelMapType = (evt: Event) => {
        evt.preventDefault();
        setInfoPanelMapType(evt.currentTarget.value);
    }

    const onChangeMapPageZoomLevel = (evt: Event) => {
        evt.preventDefault();
        setMapZoom(parseInt(evt.currentTarget.value));
    }

    const onChangeGridMargin = (evt: Event) => {
        evt.preventDefault();
        setGridMargin(evt.currentTarget.value);
    }

    const onChangeGridThumbnail = (evt: Event) => {
        evt.preventDefault();
        setGridThumbnails(evt.currentTarget.value);
    }

    const onChangeMapMapType = (evt: Event) => {
        evt.preventDefault();
        setMapMapType(evt.currentTarget.value);
    }

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
                            <div>
                                <input type="checkbox" name="showInfoPanel" class="mr-2" />
                                <label for="showInfoPanel">Show Info Panel</label>
                            </div>
                            <div>
                                <input type="checkbox" name="showRatingsPanel" class="mr-2" />
                                <label for="showRatingsPanel">Show Ratings Panel</label>
                            </div>
                            <div>
                                <input type="checkbox" name="showCommentsPanel" class="mr-2" />
                                <label for="showCommentsPanel">Show Comments Panel</label>
                            </div>
                            <div>
                                <input type="checkbox" name="showExifPanel" class="mr-2" />
                                <label for="showExifPanel">Show EXIF Panel</label>
                            </div>
                            <div>
                                <input type="checkbox" name="showHistogramPanel" class="mr-2" />
                                <label for="showEffectsPanel">Show Histogram Panel</label>
                            </div>
                            <div>
                                <input type="checkbox" name="showEffectsPanel" class="mr-2" />
                                <label for="showEffectsPanel">Show Effects Panel</label>
                            </div>
                            <div>
                                <input type="checkbox" name="showMiniMapPanel" class="mr-2" />
                                <label for="showMiniMapPanel">Show Mini-map Panel</label>
                            </div>
                            <div>
                                <input type="checkbox" name="showMetadataEditorPanel" class="mr-2" />
                                <label for="showMetadataEditorPanel">Show Metadata Editor Panel</label>
                            </div>
                            <div>
                                <input type="checkbox" name="showTeaserPanel" class="mr-2" />
                                <label for="showTeaserPanel">Show Category Teaser Chooser Panel</label>
                            </div>
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
