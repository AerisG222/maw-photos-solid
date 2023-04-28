import { Component } from "solid-js";

import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';

const ViewPhotos: Component = () => {
    return (
        <Layout toolbar={<Toolbar />} title="Stats Photos">

        </Layout>
    );
};

export default ViewPhotos;
