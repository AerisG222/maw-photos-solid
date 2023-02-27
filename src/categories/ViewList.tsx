import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";
import ListToolbar from './ToolbarList';

const ListView: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <ListToolbar />
            </Toolbar>

            <div>
                <h1>Categories - List</h1>
                <p>Here is a variable: {import.meta.env.VITE_AUTH_CLIENT_ID}</p>
            </div>
        </ContentLayout>
    );
};

export default ListView;
