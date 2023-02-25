import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const Stats: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Stats Photos</h1>
            </div>
        </ContentLayout>
    );
};

export default Stats;
