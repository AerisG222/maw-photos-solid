import { Component } from "solid-js";

import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';

const ViewVideos: Component = () => {
    return (
        <Layout toolbar={<Toolbar />} title="Stats Videos">

        </Layout>
    );
};

export default ViewVideos;
