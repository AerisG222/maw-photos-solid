import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const SettingsRandom: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Settings Random</h1>
            </div>
        </ContentLayout>
    );
};

export default SettingsRandom;
