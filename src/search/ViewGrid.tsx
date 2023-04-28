import { Component } from "solid-js";

import Toolbar from './Toolbar';
import GridToolbar from './ToolbarGrid';
import Layout from '../components/layout/Layout';

const ViewGrid: Component = () => {
    const toolbar = (
        <Toolbar>
            <GridToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} title="Search Grid">

        </Layout>
    );
};

export default ViewGrid;
