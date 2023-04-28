import { Component } from "solid-js";

import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';

const ViewFullscreen: Component = () => {
    const toolbar = (
        <Toolbar>
            <FullscreenToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} title="Random Fullscreen">

        </Layout>
    );
};

export default ViewFullscreen;
