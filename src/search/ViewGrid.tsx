import { Component } from "solid-js";

import Toolbar from './Toolbar';
import GridToolbar from './ToolbarGrid';
import Layout from '../components/layout/Layout';
import SearchBar from './components/SearchBar';

const ViewGrid: Component = () => {
    const toolbar = (
        <Toolbar>
            <GridToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar}>
            <SearchBar />
        </Layout>
    );
};

export default ViewGrid;
