import { Component, onCleanup } from "solid-js";

import { useFullscreenContext } from '../contexts/FullscreenContext';

import FullscreenToolbar from './ToolbarFullscreen';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';

const ViewFullscreen: Component = () => {
    const [fullscreen, { setFullscreen }] = useFullscreenContext();

    setFullscreen(true);
    onCleanup(() => setFullscreen(false));

    const toolbar = (
        <Toolbar>
            <FullscreenToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar} title="Photo Categories Fullscreen">

        </Layout>
    );
};

export default ViewFullscreen;
