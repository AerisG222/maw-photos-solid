import { Component, For } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import { allThumbnailSizes } from '../models/thumbnail-size';
import { allMargins } from '../models/margin';
import { allCategoryViewModes } from '../models/category-view-mode';
import Panel from './components/Panel';
import MainContent from '../components/layout/MainContent';

const ViewSearch: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Search">
                <div class="flex flex-wrap flex-gap4">
                    <Panel title="Search Page">
                        <h2 class="head2">Search Page</h2>

                        <h3 class="mt-4">View Mode</h3>
                        <For each={allCategoryViewModes}>{(mode, i) =>
                            <>
                                <div>
                                    <input type="radio" name="viewMode" value={mode.value} class="mr-2" />
                                    <label>{mode.name}</label>
                                </div>
                            </>
                        }</For>
                    </Panel>

                    <Panel title="Grid View">
                        <h3 class="mt-4">Show Category Titles</h3>
                        <input type="checkbox" name="gridShowTitles" />

                        <h3 class="mt-4">Show Category Years</h3>
                        <input type="checkbox" name="detailShowYears" />

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

                    <Panel title="List View">
                        <h3 class="mt-4">Margins</h3>
                        <div>
                            <For each={allMargins}>{(margin, i) =>
                                <>
                                    <div>
                                        <input type="radio" name="listMargin" value={margin.value} class="mr-2" />
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
                                        <input type="radio" name="listThumb" value={size.value} class="mr-2" />
                                        <label>{size.name}</label>
                                    </div>
                                </>
                            }</For>
                        </div>
                    </Panel>
                </div>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewSearch;
