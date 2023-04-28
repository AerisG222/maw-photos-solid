import { Component, Show } from "solid-js";

import { usePhotoDetailViewSettingsContext } from '../contexts/PhotoDetailViewSettingsContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';

import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import Sidebar from './components/Sidebar';
import Layout from '../components/layout/Layout';

const ViewDetail: Component = () => {
    const [settings] = usePhotoDetailViewSettingsContext();
    const [photoListState] = usePhotoListContext();
    const toolbar = (
        <Toolbar>
            <DetailToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} sidebar={<Sidebar />}>
            <Show when={settings.showBreadcrumbs}>
                <CategoryBreadcrumb />
            </Show>

            <img src={photoListState.activePhoto?.imageMd?.url} />
        </Layout>
    );
};

export default ViewDetail;
