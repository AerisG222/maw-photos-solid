import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import { getPathForViewMode } from './_routes';
import { useRandomPageSettingsContext } from '../contexts/RandomPageSettingsContext';

const Random: Component = () => {
    authGuard();

    const [settings] = useRandomPageSettingsContext();
    const navigate = useNavigate();

    navigate(getPathForViewMode(settings.viewMode));

    return (<></>);
};

export default Random;
