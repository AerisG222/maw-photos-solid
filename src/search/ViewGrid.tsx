import { Component, For } from "solid-js";

import { useCategoryContext } from '../contexts/CategoryContext';

import Toolbar from './Toolbar';
import GridToolbar from './ToolbarGrid';
import Layout from '../components/layout/Layout';
import SearchBar from './components/SearchBar';
import CategoryCard from '../categories/components/CategoryCard';
import { useSearchGridViewSettingsContext } from '../contexts/settings/SearchGridViewSettingsContext';

const ViewGrid: Component = () => {
    const [settings] = useSearchGridViewSettingsContext();
    const [categoryContext] = useCategoryContext();

    const toolbar = (
        <Toolbar>
            <GridToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} margin={settings.margin}>
            <div class="mt-4">
                <SearchBar />
            </div>

            <div class="flex flex-gap-2 flex-wrap place-content-center my-4">
                <For each={categoryContext.categories}>
                    { category =>
                        <CategoryCard
                            category={category}
                            showTitles={settings.showTitles}
                            thumbnailSize={settings.thumbnailSize}
                            showYears={settings.showYears} />
                    }
                </For>
            </div>
        </Layout>
    );
};

export default ViewGrid;
