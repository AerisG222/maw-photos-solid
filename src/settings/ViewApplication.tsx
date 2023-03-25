import { Component, onCleanup } from "solid-js";
import { produce } from 'solid-js/store';
import { appSettings, setAppSettings } from './_context';
import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const ViewApplication: Component = () => {
    const i = setInterval(() => {
        setAppSettings(produce(s => {
            s.theme = Math.random().toString();
            //setAppSettings("theme", Math.random().toString());
        }));
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
