import { Component } from "solid-js";

import { useNavigate, useParams } from '@solidjs/router';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { getPhotoCategoryPath } from './_routes';
import { GpsOverride } from '../models/utils/GpsUtils';

import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import BulkEditSidebar from './components/BulkEditSidebar';

const ViewBulkEdit: Component = () => {
    const [photoList] = usePhotoListContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);

    const onSave = (gps: GpsOverride) => {
        console.log(gps);
    };

    const onSelectAll = () => {
        console.log('select all');
    };

    const onDeselectAll = () => {
        console.log('select none');
    };

    const onHidePhotosWithGps = (hide: boolean) => {
        console.log(`hide: ${hide}`);
    };

    const toolbar = <Toolbar />;
    const sidebar = <BulkEditSidebar
        onSave={onSave}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        onHidePhotosWithGps={onHidePhotosWithGps} />;

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
