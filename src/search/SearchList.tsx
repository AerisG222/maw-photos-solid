import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import ListToolbar from './ToolbarList';

const SearchList: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <ListToolbar />
            </Toolbar>

            <div>
                <h1>Search List</h1>
            </div>
        </ContentLayout>
    );
};

export default SearchList;
