import { Component, onCleanup } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import { useAppSettings } from './_context';

const ViewApplication: Component = () => {
    const [appSettings, { setTheme }] = useAppSettings();

    const i = setInterval(() => {
        setTheme(Math.random().toString());
    }, 5000);

    onCleanup(() => clearInterval(i));

    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1>Settings Application</h1>
                <p>{appSettings.theme}</p>
            </div>
        </ContentLayout>
    );
};

export default ViewApplication;
