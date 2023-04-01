import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";
import { authGuard } from '../auth/auth';
import MainContent from '../components/layout/MainContent';

const ViewDetail: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar>
                <DetailToolbar />
            </Toolbar>

            <MainContent title="Photo Categories Detail">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewDetail;
