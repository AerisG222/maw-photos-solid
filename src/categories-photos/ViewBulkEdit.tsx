import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';

const ViewBulkEdit: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Photo Categories Bulk Edit">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewBulkEdit;
