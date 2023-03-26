import { Component } from "solid-js";
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';
import { useAppSettings } from '../contexts/AppSettingsContext';

const ViewApplication: Component = () => {
    const [appSettings, { setTheme }] = useAppSettings();

    const onChangeTheme = (evt: Event) => {
        evt.preventDefault();
        setTheme(evt.currentTarget.value);
    }

    return (
        <ContentLayout>
            <Toolbar />
            <div>
                <h1 class="head1">Settings - Application</h1>
                <div class="border-1 border-solid border-gray border-rounded-1 p-1 max-w-350px">
                    <h2 class="head2">General</h2>
                    <select onChange={onChangeTheme} value={appSettings.theme}>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </div>
            </div>
        </ContentLayout>
    );
};

export default ViewApplication;
