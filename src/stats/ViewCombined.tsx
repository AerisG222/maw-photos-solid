import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import MainContent from '../components/layout/MainContent';

const ViewCombined: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Stats Combined">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewCombined;
