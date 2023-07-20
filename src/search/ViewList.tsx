import { Component } from "solid-js";

import Toolbar from './Toolbar';
import ListToolbar from './ToolbarList';
import Layout from '../components/layout/Layout';
import SearchBar from './components/SearchBar';

const ViewList: Component = () => {
    const toolbar = (
        <Toolbar>
            <ListToolbar />
        </Toolbar>
    );

    return (
        <Layout toolbar={toolbar}>
            <SearchBar />
        </Layout>
    );
};

export default ViewList;
