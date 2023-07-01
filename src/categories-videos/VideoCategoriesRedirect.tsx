import { useNavigate, useParams } from '@solidjs/router';
import { Component } from "solid-js";
import { getVideoCategoryViewPath } from './_routes';

const VideoCategoriesRedirect: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);

    navigate(getVideoCategoryViewPath(categoryId));

    return <></>;
};

export default VideoCategoriesRedirect;
