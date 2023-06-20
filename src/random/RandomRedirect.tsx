import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";

import { getPathForViewMode } from './_routes';
import { useRandomPageSettingsContext } from '../contexts/settings/RandomPageSettingsContext';

const Random: Component = () => {
    const [settings] = useRandomPageSettingsContext();
    const navigate = useNavigate();

    navigate(getPathForViewMode(settings.viewMode));

    return (<></>);
};

export default Random;
