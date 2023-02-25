import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const StatsVideos: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Stats Videos</h1>
            </div>
        </ContentLayout>
    );
};

export default StatsVideos;
