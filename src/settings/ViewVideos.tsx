import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import { allVideoSizes } from '../models/video-size';
import { allThumbnailSizes } from '../models/thumbnail-size';
import { allMapTypes } from '../models/map-type';
import { allMapZoomLevels } from '../models/map-zoom-level';
import Panel from './components/Panel';
import MainContent from '../components/layout/MainContent';
import PanelContainer from './components/PanelContainer';
import Select from './components/Select';
import { useVideoInfoPanelSettings } from '../contexts/VideoInfoPanelSettingsContext';
import { useVideoDetailViewSettings } from '../contexts/VideoDetailViewSettingsContext';
import RadioGroup from './components/RadioGroup';
import Checkbox from './components/Checkbox';

const ViewVideos: Component = () => {
    const [detailSettings, {
        setShowBreadcrumbs: setDetailShowBreadcrumbs,
        setThumbnailSize: setDetailThumbnailSize,
        setShowVideoList: setDetailShowVideoList,
        setVideoSize: setDetailVideoSize
    }] = useVideoDetailViewSettings();
    const [infoPanelSettings, {
        setExpandInfoPanel,
        setShowRatings,
        setShowCategoryTeaserChooser,
        setShowComments,
        setShowMetadataEditor,
        setShowMinimap,
        setMinimapZoom,
        setMinimapMapType
    }] = useVideoInfoPanelSettings();

    // detail
    const onChangeDetailVideoSize = (evt: Event) => setDetailVideoSize(evt.currentTarget.value);
    const onChangeDetailThumbnailSize = (evt: Event) => setDetailThumbnailSize(evt.currentTarget.value);
    const onChangeDetailShowBreadcrumbs = (evt: Event) => setDetailShowBreadcrumbs(evt.currentTarget.value);
    const onChangeDetailShowVideoList = (evt: Event) => setDetailShowVideoList(evt.currentTarget.value);

    // infopanel
    const onExpandInfoPanelChange = (evt: Event) => setExpandInfoPanel(evt.currentTarget.checked);
    const onChangeShowRatingsPanel = (evt: Event) => setShowRatings(evt.currentTarget.checked);
    const onChangeShowCommentsPanel = (evt: Event) => setShowComments(evt.currentTarget.checked);
    const onChangeShowMetadataEditorPanel = (evt: Event) => setShowMetadataEditor(evt.currentTarget.checked);
    const onChangeShowCategoryTeaserChooserPanel = (evt: Event) => setShowCategoryTeaserChooser(evt.currentTarget.checked);
    const onChangeShowMinimapPanel = (evt: Event) => setShowMinimap(evt.currentTarget.checked);
    const onChangeInfoPanelMapType = (evt: Event) => setMinimapMapType(evt.currentTarget.value);
    const onChangeMinimapZoom = (evt: Event) => setMinimapZoom(evt.currentTarget.value);

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Videos">
                <PanelContainer>
                    <Panel title="Video Page">
                        <RadioGroup title="Video Size" groupName='detailVideoSize' itemArray={allVideoSizes} selectedValue={detailSettings.videoSizeId} onChange={onChangeDetailVideoSize} />

                        <h3 class="mt-4">Show Breadcrumbs</h3>
                        <input type="checkbox" class="toggle" name="detailShowBreadcrumbs" onChange={onChangeDetailShowBreadcrumbs} />

                        <h3 class="mt-4">Show Video List</h3>
                        <input type="checkbox" class="toggle" name="detailShowPhotoList" onChange={onChangeDetailShowVideoList} />

                        <RadioGroup title="Thumbnail Size" groupName='detailThumbnailSize' itemArray={allThumbnailSizes} selectedValue={detailSettings.thumbnailSizeId} onChange={onChangeDetailThumbnailSize} />

                        <h3 class="mt-4">Info Panel</h3>
                        <div>
                            <Checkbox title="Show Info Panel" name="showInfoPanel" isSelected={infoPanelSettings.expandInfoPanel} onChange={onExpandInfoPanelChange} />
                            <Checkbox title="Show Ratings Panel" name="showRatingsPanel" isSelected={infoPanelSettings.showRatings} onChange={onChangeShowRatingsPanel} />
                            <Checkbox title="Show Comments Panel" name="showCommentsPanel" isSelected={infoPanelSettings.showComments} onChange={onChangeShowCommentsPanel} />
                            <Checkbox title="Show Mini-map Panel" name="showMiniMapPanel" isSelected={infoPanelSettings.showMinimap} onChange={onChangeShowMinimapPanel} />
                            <Checkbox title="Show Metadata Editor Panel" name="showMetadataEditorPanel" isSelected={infoPanelSettings.showMetadataEditor} onChange={onChangeShowMetadataEditorPanel} />
                            <Checkbox title="Show Category Teaser Chooser Panel" name="showCategoryTeaserChooserPanel" isSelected={infoPanelSettings.showCategoryTeaserChooser} onChange={onChangeShowCategoryTeaserChooserPanel} />
                        </div>

                        <RadioGroup title="Minimap Type" groupName="detailMinimapType" itemArray={allMapTypes} selectedValue={infoPanelSettings.minimapMapTypeId} onChange={onChangeInfoPanelMapType} />
                        <Select title="Minimap Zoom Level" itemArray={allMapZoomLevels} selectedValue={infoPanelSettings.minimapZoomId} onChange={onChangeMinimapZoom} />
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewVideos;
