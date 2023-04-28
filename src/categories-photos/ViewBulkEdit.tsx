import { Component } from "solid-js";

import { useNavigate, useParams } from '@solidjs/router';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { getPhotoCategoryPath } from './_routes';

import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';

const ViewBulkEdit: Component = () => {
    const [photoList] = usePhotoListContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);

    const toolbar = <Toolbar />;

    if(!photoList.photos || photoList.photos.length === 0) {
        navigate(getPhotoCategoryPath(categoryId));
    }

    return (
        <Layout toolbar={toolbar} title="Photo Categories Bulk Edit">
            ...content...
        </Layout>
    );
};

export default ViewBulkEdit;
