import { Component, Show } from "solid-js";

import { usePhotoDetailViewSettingsContext } from '../contexts/PhotoDetailViewSettingsContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';

import ContentLayout from '../components/layout/ContentLayout';
import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import MainContentWithSidebar from '../components/layout/MainContentWithSidebar';
import Sidebar from './components/Sidebar';

const ViewDetail: Component = () => {
    const [settings] = usePhotoDetailViewSettingsContext();
    const [photoListState] = usePhotoListContext();

    return (
        <ContentLayout>
            <Toolbar>
                <DetailToolbar />
            </Toolbar>

            <MainContentWithSidebar sidebar={<Sidebar />}>
                <Show when={settings.showBreadcrumbs}>
                    <CategoryBreadcrumb />
                </Show>

                <img src={photoListState.activePhoto?.imageMd?.url} />
            </MainContentWithSidebar>
        </ContentLayout>
    );
};

export default ViewDetail;
