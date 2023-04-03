import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import { allRandomViewModes } from '../models/photo-view-mode';
import { allMapZoomLevels } from '../models/map-zoom-level';
import { allMapTypes } from '../models/map-type';
import { allThumbnailSizes } from '../models/thumbnail-size';
import { allMargins } from '../models/margin';
import Panel from './components/Panel';
import MainContent from '../components/layout/MainContent';
import PanelContainer from './components/PanelContainer';
import { useRandomPageSettings } from '../contexts/RandomPageSettingsContext';
import { allSlideshowDurations } from '../models/slideshow-duration';
import Select from './components/Select';
import { useRandomInfoPanelSettings } from '../contexts/RandomInfoPanelSettingsContext';
import RadioGroup from './components/RadioGroup';
import { useRandomDetailViewSettings } from '../contexts/RandomDetailViewSettingsContext';
import { useRandomGridViewSettings } from '../contexts/RandomGridViewSettingsContext';

const ViewRandom: Component = () => {
    const [pageSettings, { setViewMode, setSlideshowDisplayDurationSeconds }] = useRandomPageSettings();
    const [detailSettings, { setThumbnailSize: setDetailThumbnailSize }] = useRandomDetailViewSettings();
    const [gridSettings, { setThumbnailSize: setGridThumbnailSize, setMargin: setGridMargin }] = useRandomGridViewSettings();
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
        setMinimapMapType
    }] = useRandomInfoPanelSettings();

    const onChangeViewMode = (evt:Event) => {
        evt.preventDefault();
        setViewMode(evt.currentTarget.value);
    }

    const onChangeSlideshowDuration = (evt: Event) => {
        evt.preventDefault();
        setSlideshowDisplayDurationSeconds(evt.currentTarget.value);
    };

    const onChangeDetailThumbnail = (evt: Event) => {
        evt.preventDefault();
        setDetailThumbnailSize(evt.currentTarget.value);
    }

    const onChangeDetailMapType = (evt: Event) => {
        evt.preventDefault();
        setMinimapMapType(evt.currentTarget.value);
    }

    const onChangeDetailMiniMapZoomLevel = (evt: Event) => {
        evt.preventDefault();
        setMinimapZoom(evt.currentTarget.value);
    };

    const onChangeGridMargin = (evt: Event) => {
        evt.preventDefault();
        setGridMargin(evt.currentTarget.value);
    }

    const onChangeGridThumbnail = (evt: Event) => {
        evt.preventDefault();
        setGridThumbnailSize(evt.currentTarget.value);
    }

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Random">
                <PanelContainer>
                    <Panel title="Random Page">
                        <RadioGroup title="View Mode" groupName='pageViewMode' itemArray={allRandomViewModes} selectedValue={pageSettings.viewModeId} onChange={onChangeViewMode} />
                        <Select title="Slideshow Display Duration" itemArray={allSlideshowDurations} selectedValue={pageSettings.slideshowDisplayDurationSeconds} onChange={onChangeSlideshowDuration} />
                    </Panel>

                    <Panel title="Detail View">
                        <h3 class="mt-4">Show Breadcrumbs</h3>
                        <input type="checkbox" class="toggle" name="detailShowBreadcrumbs" />

                        <h3 class="mt-4">Show Photo List</h3>
                        <input type="checkbox" class="toggle" name="detailShowPhotoList" />

                        <RadioGroup title="Thumbnail Size" groupName='detailThumbnails' itemArray={allThumbnailSizes} selectedValue={detailSettings.thumbnailSizeId} onChange={onChangeDetailThumbnail} />

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

                        <RadioGroup title="Map Type" groupName='detailMapType' itemArray={allMapTypes} selectedValue={infoPanelSettings.minimapMapTypeId} onChange={onChangeDetailMapType} />
                        <Select title="Map Zoom Level" itemArray={allMapZoomLevels} selectedValue={infoPanelSettings.minimapZoomId} onChange={onChangeDetailMiniMapZoomLevel} />
                    </Panel>

                    <Panel title="GridView">
                        <h3 class="mt-4">Show Breadcrumbs</h3>
                        <input type="checkbox" class="toggle" name="gridShowBreadcrumbs" />

                        <RadioGroup title="Margins" groupName='gridMargin' itemArray={allMargins} selectedValue={gridSettings.marginId} onChange={onChangeGridMargin} />
                        <RadioGroup title="Thumbnail Size" groupName='gridThumbnails' itemArray={allThumbnailSizes} selectedValue={gridSettings.thumbnailSizeId} onChange={onChangeGridThumbnail} />
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewRandom;
