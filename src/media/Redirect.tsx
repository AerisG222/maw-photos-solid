import { useNavigate, useParams } from '@solidjs/router';
import { Component } from "solid-js";

import { usePhotoPageSettingsContext } from '../contexts/settings/PhotoPageSettingsContext';
import { MediaView, getMediaPathByView } from './_routes';
import { CategoryType } from '../_models/CategoryType';

const Redirect: Component = () => {
    const [settings] = usePhotoPageSettingsContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);

    navigate(getMediaPathByView(settings.viewMode as MediaView, params.categoryType as CategoryType, categoryId));

    return <></>;
};

export default Redirect;
