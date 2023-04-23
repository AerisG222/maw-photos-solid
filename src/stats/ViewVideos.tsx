import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import MainContent from '../components/layout/MainContent';

const ViewVideos: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Stats Videos">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewVideos;
