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

const ViewVideos: Component = () => {
    const [detailSettings, {
        setShowBreadcrumbs: setDetailShowBreadcrumbs,
        setThumbnailSize: setDetailThumbnailSize,
        setShowVideoList: setDetailShowVideoList,
        setVideoSize: setDetailVideoSize
    }] = useVideoDetailViewSettings();
    const [videoInfoPanelSettings, {
        setShowRatings,
        setShowCategoryTeaserChooser,
        setShowComments,
        setShowMetadataEditor,
        setShowMinimap,
        setExpandedState,
        setMinimapZoom,
        setMinimapMapType
    }] = useVideoInfoPanelSettings();

    const onChangeDetailVideoSize = (evt: Event) => {
        evt.preventDefault();
        setDetailVideoSize(evt.currentTarget.value);
    }

    const onChangeDetailThumbnailSize = (evt: Event) => {
        evt.preventDefault();
        setDetailThumbnailSize(evt.currentTarget.value);
    }

    const onChangeInfoPanelMapType = (evt: Event) => {
        evt.preventDefault();
        setMinimapMapType(evt.currentTarget.value);
    }

    const onChangeMinimapZoom = (evt: Event) => {
        evt.preventDefault();
        setMinimapZoom(evt.currentTarget.value);
    };

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Videos">
                <PanelContainer>
                    <Panel title="Video Page">
                        <RadioGroup title="Video Size" groupName='detailVideoSize' itemArray={allVideoSizes} selectedValue={detailSettings.videoSizeId} onChange={onChangeDetailVideoSize} />

                        <h3 class="mt-4">Show Breadcrumbs</h3>
                        <input type="checkbox" class="toggle" name="detailShowBreadcrumbs" />

                        <h3 class="mt-4">Show Video List</h3>
                        <input type="checkbox" class="toggle" name="detailShowPhotoList" />

                        <RadioGroup title="Thumbnail Size" groupName='detailThumbnailSize' itemArray={allThumbnailSizes} selectedValue={detailSettings.thumbnailSizeId} onChange={onChangeDetailThumbnailSize} />

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

                        <RadioGroup title="Minimap Type" groupName="detailMinimapType" itemArray={allMapTypes} selectedValue={videoInfoPanelSettings.minimapMapTypeId} onChange={onChangeInfoPanelMapType} />
                        <Select title="Minimap Zoom Level" itemArray={allMapZoomLevels} selectedValue={videoInfoPanelSettings.minimapZoomId} onChange={onChangeMinimapZoom} />
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewVideos;
