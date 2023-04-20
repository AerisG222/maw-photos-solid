import { Component, Show } from "solid-js";

import { authGuard } from '../auth/auth';
import { usePhotoDetailViewSettingsContext } from '../contexts/PhotoDetailViewSettingsContext';

import ContentLayout from '../components/layout/ContentLayout';
import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';

const ViewDetail: Component = () => {
    authGuard();

    const [settings] = usePhotoDetailViewSettingsContext();

    return (
        <ContentLayout>
            <Toolbar>
                <DetailToolbar />
            </Toolbar>

            <MainContent>
                <Show when={settings.showBreadcrumbs}>
                    <CategoryBreadcrumb />
                </Show>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewDetail;
