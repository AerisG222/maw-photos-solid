import { Component, For } from "solid-js";
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

const ViewPhotos: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Photos">
                <PanelContainer>
                    <Panel title="Photo Category Page">
                        <h3 class="mt-4">View</h3>
                        <For each={allPhotoViewModes}>{(mode, i) =>
                            <>
                                <div>
                                    <input type="radio" name="viewMode" value={mode.value} class="mr-2" />
                                    <label>{mode.name}</label>
                                </div>
                            </>
                        }</For>

                        <h3 class="mt-4">Slideshow Display Duration</h3>
                        <select>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="45">45</option>
                            <option value="60">60</option>
                        </select>
                    </Panel>

                    <Panel title="Detail View">
                        <h3 class="mt-4">Show Breadcrumbs</h3>
                        <input type="checkbox" name="detailShowBreadcrumbs" />

                        <h3 class="mt-4">Show Photo List</h3>
                        <input type="checkbox" name="detailShowPhotoList" />

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

                        <h3 class="mt-4">Map Type</h3>
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

                        <h3 class="mt-4">Map Zoom Level</h3>
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

                    <Panel title="Grid View">
                        <h3 class="mt-4">Show Breadcrumbs</h3>
                        <input type="checkbox" name="gridShowBreadcrumbs" />

                        <h3 class="mt-4">Margins</h3>
                        <div>
                            <For each={allMargins}>{(margin, i) =>
                                <>
                                    <div>
                                        <input type="radio" name="gridMargin" value={margin.value} class="mr-2" />
                                        <label>{margin.name}</label>
                                    </div>
                                </>
                            }</For>
                        </div>

                        <h3 class="mt-4">Thumbnail Size</h3>
                        <div>
                            <For each={allThumbnailSizes}>{(size, i) =>
                                <>
                                    <div>
                                        <input type="radio" name="gridThumb" value={size.value} class="mr-2" />
                                        <label>{size.name}</label>
                                    </div>
                                </>
                            }</For>
                        </div>
                    </Panel>

                    <Panel title="Map View">
                        <h3 class="mt-4">Map Type</h3>
                        <div>
                            <For each={allMapTypes}>{(type, i) =>
                                <>
                                    <div>
                                        <input type="radio" name="mapMapType" value={type.value} class="mr-2" />
                                        <label>{type.name}</label>
                                    </div>
                                </>
                            }</For>
                        </div>

                        <h3 class="mt-4">Map Zoom Level</h3>
                        <div>
                            <select name="mapMapZoomLevel">
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

export default ViewPhotos;
