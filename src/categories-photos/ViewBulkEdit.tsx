import { Component } from "solid-js";

import { useNavigate, useParams } from '@solidjs/router';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { getPhotoCategoryPath } from './_routes';

import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from "./Toolbar";
import MainContent from '../components/layout/MainContent';

const ViewBulkEdit: Component = () => {
    const [photoList] = usePhotoListContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);

    if(!photoList.photos || photoList.photos.length === 0) {
        navigate(getPhotoCategoryPath(categoryId));
    }

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Photo Categories Bulk Edit">

            </MainContent>
        </ContentLayout>
    );
};

export default ViewBulkEdit;
