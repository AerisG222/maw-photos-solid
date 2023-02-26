import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const ViewSearch: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Settings Search</h1>
            </div>
        </ContentLayout>
    );
};

export default ViewSearch;
