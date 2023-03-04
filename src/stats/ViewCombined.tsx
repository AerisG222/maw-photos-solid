import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const ViewCombined: Component = () => {
    authGuard();

    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Stats Combined</h1>
            </div>
        </ContentLayout>
    );
};

export default ViewCombined;
