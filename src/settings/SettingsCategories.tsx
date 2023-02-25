import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const SettingsCategories: Component = () => {
    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Settings Categories</h1>
            </div>
        </ContentLayout>
    );
};

export default SettingsCategories;
