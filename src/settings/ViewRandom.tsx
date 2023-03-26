import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const ViewRandom: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1 class="head1">Settings - Random</h1>
            </div>
        </ContentLayout>
    );
};

export default ViewRandom;
