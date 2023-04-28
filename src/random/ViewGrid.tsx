import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import GridToolbar from './ToolbarGrid';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';
import Layout from '../components/layout/Layout';

const ViewGrid: Component = () => {
    const toolbar = (
        <Toolbar>
            <GridToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} title="Random Grid">

        </Layout>
    );
};

export default ViewGrid;
