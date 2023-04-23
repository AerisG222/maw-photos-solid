import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import DetailToolbar from './ToolbarDetail';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';

const ViewDetail: Component = () => {
    return (
        <ContentLayout>
            <Toolbar>
                <DetailToolbar />
            </Toolbar>

            <MainContent title="Random Detail">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewDetail;
