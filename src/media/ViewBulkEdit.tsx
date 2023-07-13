import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { useNavigate, useParams } from '@solidjs/router';

import { useMediaListContext } from '../contexts/MediaListContext';
import { categoriesPhotosBulkEdit, getPhotoCategoryPath } from '../categories-photos/_routes';
import { Media } from '../models/Media';
import { useMetadataEditServiceContext } from '../contexts/MetadataEditServiceContext';
import { GpsCoordinate } from '../api/models/GpsCoordinate';

import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import BulkEditSidebar from './bulk-edit/BulkEditSidebar';

type SelectableMedia = {
    id: number,
    isSelected: boolean,
    imageUrl: string,
    latitude?: number,
    longitude?: number
};

const ViewBulkEdit: Component = () => {
    const { fetchGpsDetail, setGpsCoordinateOverride } = useMetadataEditServiceContext();
    const [media, setMedia] = createSignal<SelectableMedia[]>([]);
    const [hideMediaWithGps, setHideMediaWithGps] = createSignal(false);
    const [mediaList, { setActiveRouteDefinition, setGpsOverride }] = useMediaListContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);

    setActiveRouteDefinition(categoriesPhotosBulkEdit);

    const buildSelectableMedia = (media: Media) => ({
        id: media.id,
        imageUrl: media.imageXsSqUrl ?? media.thumbnailSq,
        latitude: media.latitude,
        longitude: media.longitude,
        isSelected: false
    });

    const onSave = async (gps: GpsCoordinate) => {
        const mediaToUpdate = media().filter(p => p.isSelected);

        // assume success - make sure photos that may be removed from view are not still tracked as
        // participating in a future edit
        setAll(false);

        for(const media of mediaToUpdate) {
            await setGpsCoordinateOverride(media.id, gps);
            setGpsOverride(media.id, gps);
        }
    };

    const setAll = (doSelect: boolean) => {
        setMedia(media =>
            media.map(m => {
                if(m.isSelected === doSelect) {
                    return m;
                }

                return {...m, isSelected: doSelect}
            })
        )
    };

    const onHideMediaWithGps = (hide: boolean) => {
        setAll(false);
        setHideMediaWithGps(hide);
    };

    const toggle = (media: SelectableMedia) => {
        setMedia(prev =>
            prev.map(m => {
                if(m.imageUrl === media.imageUrl) {
                    return {...m, isSelected: !m.isSelected };
                }

                return m;
            })
        );
    };

    if(!mediaList.items || mediaList.items.length === 0) {
        navigate(getPhotoCategoryPath(categoryId));
    }

    createEffect(() => {
        setMedia(mediaList.items.map(buildSelectableMedia));
    })

    const toolbar = <Toolbar />;
    const sidebar = <BulkEditSidebar
        onSave={onSave}
        onSelectAll={() => setAll(true)}
        onDeselectAll={() => setAll(false)}
        onHideMediaWithGps={onHideMediaWithGps} />;

    return (
        <Layout toolbar={toolbar} sidebar={sidebar}>
            <CategoryBreadcrumb />

            <div class="flex flex-wrap flex-gap-2 mx-8 flex-justify-center">
                <For each={media()}>{ m =>
                    <Show when={hideMediaWithGps() ? !m.latitude && !m.longitude : true}>
                        <div class="border-1 border-color-primary:40 hover:border-color-primary cursor-pointer text-center bg-secondary-content:6" onClick={() => toggle(m)}>
                            <input type="checkbox" class="checkbox checkbox-sm mt-1" checked={m.isSelected} onInput={evt => m.isSelected = evt.currentTarget.checked} />
                            <img src={m.imageUrl} class="w-160px h-120px" />
                        </div>
                    </Show>
                }</For>
            </div>
        </Layout>
    );
};

export default ViewBulkEdit;
