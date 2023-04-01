import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";
import GridToolbar from './ToolbarGrid';
import MainContent from '../components/layout/MainContent';

const GridView: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <MainContent title="Categories - Grid">
                <p>Here is a variable: {import.meta.env.VITE_AUTH_CLIENT_ID}</p>
            </MainContent>
        </ContentLayout>
    );
};

export default GridView;
