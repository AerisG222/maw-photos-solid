import { Component, For } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import { allVideoSizes } from '../models/video-size';
import { allThumbnailSizes } from '../models/thumbnail-size';
import { allMapTypes } from '../models/map-type';
import { allMapZoomLevels } from '../models/map-zoom-level';
import Panel from './components/Panel';
import MainContent from '../components/layout/MainContent';
import PanelContainer from './components/PanelContainer';

const ViewVideos: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Videos">
                <PanelContainer>
                    <Panel title="Video Page">
                        <h3 class="mt-4">Video Size</h3>
                        <For each={allVideoSizes}>{(mode, i) =>
                            <>
                                <div>
                                    <input type="radio" name="viewMode" value={mode.value} class="mr-2" />
                                    <label>{mode.name}</label>
                                </div>
                            </>
                        }</For>

                        <h3 class="mt-4">Show Breadcrumbs</h3>
                        <input type="checkbox" class="toggle" name="detailShowBreadcrumbs" />

                        <h3 class="mt-4">Show Video List</h3>
                        <input type="checkbox" class="toggle" name="detailShowPhotoList" />

                        <h3 class="mt-4">Thumbnail Size</h3>
                        <div>
                            <For each={allThumbnailSizes}>{(size, i) =>
                                <>
                                    <div>
                                        <input type="radio" name="detailThumb" value={size.value} class="mr-2" />
                                        <label>{size.name}</label>
                                    </div>
                                </>
                            }</For>
                        </div>

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

                        <h3 class="mt-4">Minimap Type</h3>
                        <div>
                            <For each={allMapTypes}>{(type, i) =>
                                <>
                                    <div>
                                        <input type="radio" name="detailMapType" value={type.value} class="mr-2" />
                                        <label>{type.name}</label>
                                    </div>
                                </>
                            }</For>
                        </div>

                        <h3 class="mt-4">Minimap Zoom Level</h3>
                        <div>
                            <select name="detailMapZoomLevel">
                                <For each={allMapZoomLevels}>{(zoom, i) =>
                                    <>
                                        <option value={zoom.value} class="mr-2">{zoom.name}</option>
                                    </>
                                }</For>
                            </select>
                        </div>
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewVideos;
