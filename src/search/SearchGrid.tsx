import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import GridToolbar from './ToolbarGrid';

const SearchGrid: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <GridToolbar />
            </Toolbar>

            <div>
                <h1>Search Grid</h1>
            </div>
        </ContentLayout>
    );
};

export default SearchGrid;
