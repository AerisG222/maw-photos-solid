import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import GridToolbar from './ToolbarGrid';
import Toolbar from "./Toolbar";
import { authGuard } from '../auth/auth';

const ViewGrid: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <div>
                <h1>Random Grid</h1>
            </div>
        </ContentLayout>
    );
};

export default ViewGrid;
