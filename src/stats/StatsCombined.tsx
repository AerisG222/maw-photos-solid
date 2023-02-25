import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const StatsCombined: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Stats Combined</h1>
            </div>
        </ContentLayout>
    );
};

export default StatsCombined;
