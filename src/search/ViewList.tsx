import { Component, For } from "solid-js";

import { useSearchListViewSettingsContext } from '../contexts/settings/SearchListViewSettingsContext';
import { useSearchContext } from './contexts/SearchContext';

import Toolbar from './Toolbar';
import ListToolbar from './ToolbarList';
import Layout from '../components/layout/Layout';
import SearchBar from './components/SearchBar';
import CategoryListItem from '../categories/components/CategoryListItem';

const ViewList: Component = () => {
    const [settings] = useSearchListViewSettingsContext();
    const [searchContext] = useSearchContext();

    const toolbar = (
        <Toolbar>
            <ListToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} margin={settings.margin}>
            <div class="mt-4">
                <SearchBar />
            </div>

            <div class="my-4">
                <For each={searchContext.categories}>{ category =>
                    <CategoryListItem
                        category={category}
                        showYear={true}
                        thumbnailSize={settings.thumbnailSize} />
                }</For>
            </div>
        </Layout>
    );
};

export default ViewList;
