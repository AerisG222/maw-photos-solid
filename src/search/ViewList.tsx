import { Component } from "solid-js";

import Toolbar from './Toolbar';
import ListToolbar from './ToolbarList';
import Layout from '../components/layout/Layout';

const ViewList: Component = () => {
    const toolbar = (
        <Toolbar>
            <ListToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} title="Search List">

        </Layout>
    );
};

export default ViewList;
