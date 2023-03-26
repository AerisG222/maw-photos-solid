import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const ViewVideos: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1 class="head1">Settings - Videos</h1>
            </div>
        </ContentLayout>
    );
};

export default ViewVideos;
