import { Component } from "solid-js";

import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';

const ViewDetail: Component = () => {
    const toolbar = (
        <Toolbar>
            <DetailToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} title="Random Detail">

        </Layout>
    );
};

export default ViewDetail;
