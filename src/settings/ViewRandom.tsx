import { Component, For } from "solid-js";

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

const ViewRandom: Component = () => {
    const [pageSettings, { setViewMode, setSlideshowDisplayDurationSeconds }] = useRandomPageSettings();
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

    const onChangeSlideshowDuration = (evt: Event) => {
        evt.preventDefault();
        setSlideshowDisplayDurationSeconds(evt.currentTarget.value);
    };

    const onChangeDetailMiniMapZoomLevel = (evt: Event) => {
        evt.preventDefault();
        setMinimapZoom(evt.currentTarget.value);
    };

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Random">
                <PanelContainer>
                    <Panel title="Random Page">
                        <h3 class="mt-4">View Mode</h3>
                        <For each={allRandomViewModes}>{(mode, i) =>
                            <>
                                <div>
                                    <input type="radio" name="viewMode" value={mode.value} class="mr-2" />
                                    <label>{mode.name}</label>
                                </div>
                            </>
                        }</For>

                        <Select title="Slideshow Display Duration" itemArray={allSlideshowDurations} selectedValue={pageSettings.slideshowDisplayDurationSeconds} onChange={onChangeSlideshowDuration} />
                    </Panel>

                    <Panel title="Detail View">
                        <h3 class="mt-4">Show Breadcrumbs</h3>
                        <input type="checkbox" class="toggle" name="detailShowBreadcrumbs" />

                        <h3 class="mt-4">Show Photo List</h3>
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

                        <Select title="Map Zoom Level" itemArray={allMapZoomLevels} selectedValue={infoPanelSettings.minimapZoomId} onChange={onChangeDetailMiniMapZoomLevel} />
                    </Panel>

                    <Panel title="GridView">
                        <h3 class="mt-4">Show Breadcrumbs</h3>
                        <input type="checkbox" class="toggle" name="gridShowBreadcrumbs" />

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
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewRandom;
