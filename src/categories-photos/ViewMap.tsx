import { Component } from "solid-js";

import MapToolbar from './ToolbarMap';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';

const ViewMap: Component = () => {
    const toolbar = (
        <Toolbar>
            <MapToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} title="Photo Categories Map">

        </Layout>
    );
};

export default ViewMap;
