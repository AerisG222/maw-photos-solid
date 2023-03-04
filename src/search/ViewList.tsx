import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import ListToolbar from './ToolbarList';

const ViewList: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar>
                <ListToolbar />
            </Toolbar>

            <div>
                <h1>Search List</h1>
            </div>
        </ContentLayout>
    );
};

export default ViewList;
