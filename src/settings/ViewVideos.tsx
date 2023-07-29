import { Component } from "solid-js";

import { useVideoInfoPanelSettingsContext } from '../contexts/settings/VideoInfoPanelSettingsContext';
import { useVideoDetailViewSettingsContext } from '../contexts/settings/VideoDetailViewSettingsContext';
import { allThumbnailSizes } from '../_models/ThumbnailSize';
import { allMapTypes } from '../_models/MapType';
import { allMapZoomLevels } from '../_models/MapZoomLevel';

import Panel from './components/Panel';
import PanelContainer from './components/PanelContainer';
import Select from './components/Select';
import RadioGroup from './components/RadioGroup';
import Checkbox from './components/Checkbox';
import Toolbar from './Toolbar';
import Toggle from './components/Toggle';
import Layout from '../components/layout/Layout';

const ViewVideos: Component = () => {
    const [detailSettings, {
        setShowBreadcrumbs: setDetailShowBreadcrumbs,
        setThumbnailSize: setDetailThumbnailSize,
        setShowVideoList: setDetailShowVideoList,
    }] = useVideoDetailViewSettingsContext();
    const [infoPanelSettings, {
        setExpandInfoPanel,
        setShowRatings,
        setShowCategoryTeaserChooser,
        setShowComments,
        setShowMetadataEditor,
        setShowMinimap,
        setMinimapZoom,
        setMinimapMapType
    }] = useVideoInfoPanelSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Settings - Videos">
            <PanelContainer>
                <Panel title="Video Page">
                    <Toggle title="Show Breadcrumbs" name="detailShowBreadcrumbs" isSelected={detailSettings.showBreadcrumbs} onChange={setDetailShowBreadcrumbs} />
                    <Toggle title="Show Video List" name="detailShowPhotoList" isSelected={detailSettings.showVideoList} onChange={setDetailShowVideoList} />
                    <RadioGroup title="Thumbnail Size" groupName='detailThumbnailSize' itemArray={allThumbnailSizes} selectedValue={detailSettings.thumbnailSize} onChange={setDetailThumbnailSize} />

                    <h3 class="mt-4 color-secondary">Info Panel</h3>
                    <div>
                        <Checkbox title="Show Info Panel" name="showInfoPanel" isSelected={infoPanelSettings.expandInfoPanel} onChange={setExpandInfoPanel} />
                        <Checkbox title="Show Ratings Panel" name="showRatingsPanel" isSelected={infoPanelSettings.showRatings} onChange={setShowRatings} />
                        <Checkbox title="Show Comments Panel" name="showCommentsPanel" isSelected={infoPanelSettings.showComments} onChange={setShowComments} />
                        <Checkbox title="Show Mini-map Panel" name="showMiniMapPanel" isSelected={infoPanelSettings.showMinimap} onChange={setShowMinimap} />
                        <Checkbox title="Show Metadata Editor Panel" name="showMetadataEditorPanel" isSelected={infoPanelSettings.showMetadataEditor} onChange={setShowMetadataEditor} />
                        <Checkbox title="Show Category Teaser Chooser Panel" name="showCategoryTeaserChooserPanel" isSelected={infoPanelSettings.showCategoryTeaserChooser} onChange={setShowCategoryTeaserChooser} />
                    </div>

                    <RadioGroup title="Minimap Type" groupName="detailMinimapType" itemArray={allMapTypes} selectedValue={infoPanelSettings.minimapMapType} onChange={setMinimapMapType} />
                    <Select title="Minimap Zoom Level" itemArray={allMapZoomLevels} selectedValue={infoPanelSettings.minimapZoom} onChange={val => setMinimapZoom(parseInt(val))} />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewVideos;
