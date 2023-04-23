import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";

import { getPathForViewMode } from './_routes';
import { useSearchPageSettingsContext } from '../contexts/SearchPageSettingsContext';

const SearchRedirect: Component = () => {
    const [settings] = useSearchPageSettingsContext();
    const navigate = useNavigate();

    navigate(getPathForViewMode(settings.viewMode));

    return (<></>);
};

export default SearchRedirect;
