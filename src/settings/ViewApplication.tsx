import { Component, onCleanup } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import { useAppSettings } from '../contexts/AppSettingsContext';

const ViewApplication: Component = () => {
    const [appSettings, { setTheme }] = useAppSettings();

    const i = setInterval(() => {
        if(appSettings.theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
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
