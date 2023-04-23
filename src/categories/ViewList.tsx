import { Component, For, Suspense } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";
import ListToolbar from './ToolbarList';
import MainContent from '../components/layout/MainContent';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useCategoryListViewSettingsContext } from '../contexts/CategoryListViewSettingsContext';
import { useCategoryFilterSettingsContext } from '../contexts/CategoryFilterSettingsContext';
import CategoryFilterBar from './components/CategoryFilterBar';
import YearList from './components/YearList';

const ListView: Component = () => {
    const [categoryState, { getCategories, getYears }] = useCategoryContext();
    const [settings] = useCategoryListViewSettingsContext();
    const [filter] = useCategoryFilterSettingsContext();

    return (
        <ContentLayout>
            <Toolbar>
                <ListToolbar />
            </Toolbar>

            <Suspense fallback={<p>Loading...</p>}>
                <MainContent margin={settings.margin}>
                    <CategoryFilterBar />

                    <For each={getYears(filter.yearFilter, filter.typeFilter)}>{ year =>
                        <div class="mb-4">
                            <YearList year={year} categories={getCategories(year, filter.typeFilter)} />
                        </div>
                    }</For>
                </MainContent>
            </Suspense>
        </ContentLayout>
    );
};

export default ListView;
