import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import ListToolbar from './ToolbarList';
import MainContent from '../components/layout/MainContent';

const ViewList: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar>
                <ListToolbar />
            </Toolbar>

            <MainContent title="Search List">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewList;
