import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const SettingsVideos: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Settings Videos</h1>
            </div>
        </ContentLayout>
    );
};

export default SettingsVideos;
