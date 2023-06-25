import { Component } from "solid-js";

import { useNavigate, useParams } from '@solidjs/router';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { getPhotoCategoryPath } from './_routes';

import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import BulkEditSidebar from './components/BulkEditSidebar';
import { GpsOverride } from '../models/utils/GpsUtils';

const ViewBulkEdit: Component = () => {
    const [photoList] = usePhotoListContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);

    const onSave = (gps: GpsOverride) => {
        console.log(gps);
    }

    const toolbar = <Toolbar />;
    const sidebar = <BulkEditSidebar onSave={onSave} />;

    if(!photoList.photos || photoList.photos.length === 0) {
        navigate(getPhotoCategoryPath(categoryId));
    }

    return (
        <Layout toolbar={toolbar} sidebar={sidebar}>
            <CategoryBreadcrumb />
        </Layout>
    );
};

export default ViewBulkEdit;
