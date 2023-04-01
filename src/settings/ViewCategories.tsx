import { Component, For } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import { allCategoryTypeFilters } from '../models/category-type-filter';
import { allCategoryViewModes } from '../models/category-view-mode';
import { allMargins } from '../models/margin';
import { allThumbnailSizes } from '../models/thumbnail-size';
import Toolbar from './Toolbar';
import Panel from './components/Panel';

const ViewCategories: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div class="overflow-y-auto pb-8">
                <h1 class="head1">Settings - Categories</h1>

                <div class="flex flex-wrap flex-gap4">
                    <Panel title="Category Page">
                        <h3>Type Filter</h3>
                        <For each={allCategoryTypeFilters}>{(type, i) =>
                            <>
                                <div>
                                    <input type="radio" name="typeFilter" value={type.value} class="mr-2" />
                                    <label>{type.name}</label>
                                </div>
                            </>
                        }</For>

                        <h3 class="mt-4">View</h3>
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
                        <h3>Show Titles</h3>
                        <div>
                            <input type="checkbox" name="showTitles" />
                        </div>

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
            </div>
        </ContentLayout>
    );
};

export default ViewCategories;
