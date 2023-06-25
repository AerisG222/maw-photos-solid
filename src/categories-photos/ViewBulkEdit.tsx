import { Component, For, createSignal } from "solid-js";

import { useNavigate, useParams } from '@solidjs/router';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { getPhotoCategoryPath } from './_routes';
import { GpsOverride } from '../models/utils/GpsUtils';
import { Photo } from '../models/Photo';

import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import BulkEditSidebar from './components/BulkEditSidebar';

type SelectablePhoto = {
    isSelected: boolean,
    imageUrl: string
};

const ViewBulkEdit: Component = () => {
    const [photos, setPhotos] = createSignal<SelectablePhoto[]>([]);
    const [photoList] = usePhotoListContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);

    const buildSelectablePhoto = (photo: Photo) => ({
        isSelected: false,
        imageUrl: photo.imageXsSqUrl
    });

    const onSave = (gps: GpsOverride) => {
        console.log(gps);
    };

    const setAll = (doSelect: boolean) => {
        setPhotos(photos =>
            photos.map(p => {
                if(p.isSelected === doSelect) {
                    return p;
                }

                return {...p, isSelected: doSelect}
            })
        )
    };

    const onHidePhotosWithGps = (hide: boolean) => {
        let photos: Photo[] = [];

        if(hide) {
            photos = photoList.photos.filter(x => !x.latitude && !x.longitude);
        } else {
            photos = photoList.photos;
        }

        setPhotos(photos.map(buildSelectablePhoto));
    };

    const toggle = (photo: SelectablePhoto) => {
        setPhotos(photos =>
            photos.map(p => {
                if(p.imageUrl === photo.imageUrl) {
                    return {...p, isSelected: !p.isSelected };
                }

                return p;
            })
        );
    };

    if(!photoList.photos || photoList.photos.length === 0) {
        navigate(getPhotoCategoryPath(categoryId));
    }

    setPhotos(photoList.photos.map(buildSelectablePhoto));

    const toolbar = <Toolbar />;
    const sidebar = <BulkEditSidebar
        onSave={onSave}
        onSelectAll={() => setAll(true)}
        onDeselectAll={() => setAll(false)}
        onHidePhotosWithGps={onHidePhotosWithGps} />;

    return (
        <Layout toolbar={toolbar} sidebar={sidebar}>
            <CategoryBreadcrumb />

            <div class="flex flex-wrap flex-gap-2 mx-8 flex-justify-center">
                <For each={photos()}>{ photo =>
                    <div class="border-1 border-color-primary:40 hover:border-color-primary cursor-pointer text-center bg-secondary-content:6" onClick={() => toggle(photo)}>
                        <input type="checkbox" class="checkbox checkbox-sm mt-1" checked={photo.isSelected} onInput={evt => photo.isSelected = evt.currentTarget.checked} />
                        <img src={photo.imageUrl} class="w-160px h-120px" />
                    </div>
                }</For>
            </div>
        </Layout>
    );
};

export default ViewBulkEdit;
