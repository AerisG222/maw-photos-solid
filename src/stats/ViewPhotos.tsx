import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import MainContent from '../components/layout/MainContent';

const ViewPhotos: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Stats Photos">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewPhotos;
