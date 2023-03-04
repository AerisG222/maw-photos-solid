import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import { searchGrid } from './_routes';

const Search: Component = () => {
    authGuard();

    const navigate = useNavigate();

    navigate(searchGrid.path);

    return (<></>);
};

export default Search;
