import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";
import { authGuard } from '../auth/auth';
import { categoriesPhotosGrid } from './_routes';

const PhotoCategories: Component = () => {
    authGuard();

    const navigate = useNavigate();

    navigate(categoriesPhotosGrid.path);

    return (<></>);
};

export default PhotoCategories;
