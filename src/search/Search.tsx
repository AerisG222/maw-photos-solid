import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import { getPathForViewMode } from './_routes';
import { useSearchPageSettings } from '../contexts/SearchPageSettingsContext';

const Search: Component = () => {
    authGuard();

    const [settings] = useSearchPageSettings();
    const navigate = useNavigate();

    navigate(getPathForViewMode(settings.viewMode));

    return (<></>);
};

export default Search;
