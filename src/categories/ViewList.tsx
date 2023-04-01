import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";
import ListToolbar from './ToolbarList';
import MainContent from '../components/layout/MainContent';

const ListView: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar>
                <ListToolbar />
            </Toolbar>

            <MainContent title="Categories - List">
                <p>Here is a variable: {import.meta.env.VITE_AUTH_CLIENT_ID}</p>
            </MainContent>
        </ContentLayout>
    );
};

export default ListView;
