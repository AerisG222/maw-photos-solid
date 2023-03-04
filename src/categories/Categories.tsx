import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import { categoriesGrid } from './_routes';

const Categories: Component = () => {
    authGuard();

    const navigate = useNavigate();

    navigate(categoriesGrid.path);

    return (<></>);
};

export default Categories;
