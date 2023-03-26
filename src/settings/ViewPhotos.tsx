import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const ViewPhotos: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1 class="head1">Settings - Photos</h1>
            </div>
        </ContentLayout>
    );
};

export default ViewPhotos;
