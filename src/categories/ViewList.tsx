import { Component, For, Suspense } from "solid-js";

import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";
import ListToolbar from './ToolbarList';
import MainContent from '../components/layout/MainContent';
import { useCategory } from '../contexts/CategoryContext';
import { useCategoryListViewSettings } from '../contexts/CategoryListViewSettingsContext';
import { useCategoryFilterSettings } from '../contexts/CategoryFilterSettingsContext';
import CategoryFilterBar from './components/CategoryFilterBar';
import YearList from './components/YearList';

const ListView: Component = () => {
    authGuard();

    const [categoryState, { getCategories, getYears }] = useCategory();
    const [settings] = useCategoryListViewSettings();
    const [filter] = useCategoryFilterSettings();

    return (
        <ContentLayout>
            <Toolbar>
                <ListToolbar />
            </Toolbar>

            <Suspense fallback={<p>Loading...</p>}>
                <MainContent margin={settings.margin}>
                    <CategoryFilterBar />

                    <For each={getYears(filter.yearFilter, filter.typeFilter)}>{ year =>
                        <YearList year={year} categories={getCategories(year, filter.typeFilter)}/>
                    }</For>
                </MainContent>
            </Suspense>
        </ContentLayout>
    );
};

export default ListView;
