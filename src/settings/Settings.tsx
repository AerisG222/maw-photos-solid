import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";

import { settingsApplication } from './_routes';

const Settings: Component = () => {
    const navigate = useNavigate();

    navigate(settingsApplication.path);

    return (<></>);
};

export default Settings;
