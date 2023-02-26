import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const ViewApplication: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Settings Application</h1>
            </div>
        </ContentLayout>
    );
};

export default ViewApplication;
