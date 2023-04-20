import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import { getPathForViewMode } from './_routes';
import { useSearchPageSettingsContext } from '../contexts/SearchPageSettingsContext';

const Search: Component = () => {
    authGuard();

    const [settings] = useSearchPageSettingsContext();
    const navigate = useNavigate();

    navigate(getPathForViewMode(settings.viewMode));

    return (<></>);
};

export default Search;
