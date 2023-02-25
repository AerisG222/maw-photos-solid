import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const Settings: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Settings</h1>
            </div>
        </ContentLayout>
    );
};

export default Settings;
