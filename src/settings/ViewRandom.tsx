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
import Checkbox from './components/Checkbox';

const ViewRandom: Component = () => {
    const [pageSettings, { setViewMode, setSlideshowDisplayDurationSeconds }] = useRandomPageSettings();
    const [detailSettings, { setThumbnailSize: setDetailThumbnailSize }] = useRandomDetailViewSettings();
    const [gridSettings, { setThumbnailSize: setGridThumbnailSize, setMargin: setGridMargin }] = useRandomGridViewSettings();
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

    const onExpandInfoPanelChange = (evt: Event) => setExpandInfoPanel(evt.currentTarget.checked);
    const onChangeShowRatingsPanel = (evt: Event) => setShowRatings(evt.currentTarget.checked);
    const onChangeShowCommentsPanel = (evt: Event) => setShowComments(evt.currentTarget.checked);
    const onChangeShowExifPanel = (evt: Event) => setShowExif(evt.currentTarget.checked);
    const onChangeShowHistogramPanel = (evt: Event) => setShowHistogram(evt.currentTarget.checked);
    const onChangeShowEffectsPanel = (evt: Event) => setShowEffects(evt.currentTarget.checked);
    const onChangeShowMinimapPanel = (evt: Event) => setShowMinimap(evt.currentTarget.checked);
    const onChangeShowMetadataEditorPanel = (evt: Event) => setShowMetadataEditor(evt.currentTarget.checked);
    const onChangeShowCategoryTeaserChooserPanel = (evt: Event) => setShowCategoryTeaserChooser(evt.currentTarget.checked);

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
