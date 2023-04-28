import { Component } from "solid-js";

import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';

const ViewCombined: Component = () => {
    return (
        <Layout toolbar={<Toolbar />} title="Stats Combined">

        </Layout>
    );
};

export default ViewCombined;
