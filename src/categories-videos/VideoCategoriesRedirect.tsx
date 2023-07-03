import { useNavigate, useParams } from '@solidjs/router';
import { Component } from "solid-js";
import { getVideoCategoryViewPath } from './_routes';
import { useVideoDetailViewSettingsContext } from '../contexts/settings/VideoDetailViewSettingsContext';

const VideoCategoriesRedirect: Component = () => {
    const [settings] = useVideoDetailViewSettingsContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);

    navigate(getVideoCategoryViewPath('detail', categoryId));

    return <></>;
};

export default VideoCategoriesRedirect;
