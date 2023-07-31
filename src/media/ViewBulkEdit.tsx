import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { useNavigate, useParams } from '@solidjs/router';

import { useMediaListContext } from './contexts/MediaListContext';
import { Media, MediaTypePhoto, MediaTypeVideo, MediaTypes, getMediaTeaserUrl } from '../_models/Media';
import { GpsCoordinate } from '../_models/Gps';
import { MediaViewModeGrid, categoryBulkEditRoute, getMediaCategoryPath, getMediaPathByView } from './_routes';
import { CategoryType } from '../_models/CategoryType';
import { IMetadataEditService } from '../_services/media/IMetadataEditService';
import { photoMediaService } from '../_services/media/PhotoMediaService';
import { videoMediaService } from '../_services/media/VideoMediaService';

import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';
import CategoryBreadcrumb from '../components/categories/CategoryBreadcrumb';
import BulkEditSidebar from './bulk-edit/BulkEditSidebar';
import AdminGuard from '../components/auth/AdminGuard';

type SelectableMedia = {
    id: number,
    kind: MediaTypes,
    isSelected: boolean,
    imageUrl: string,
    latitude?: number,
    longitude?: number
};

const ViewBulkEdit: Component = () => {
    const [media, setMedia] = createSignal<SelectableMedia[]>([]);
    const [hideMediaWithGps, setHideMediaWithGps] = createSignal(false);
    const [mediaList, { setActiveRouteDefinition, setGpsOverride }] = useMediaListContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);

    setActiveRouteDefinition(categoryBulkEditRoute);

    const buildSelectableMedia = (media: Media) => ({
        id: media.id,
        kind: media.kind,
        imageUrl: getMediaTeaserUrl(media),
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
            let svc: IMetadataEditService = undefined;

            switch(media.kind) {
                case MediaTypePhoto:
                    svc = photoMediaService;
                    break;
                case MediaTypeVideo:
                    svc = videoMediaService;
                    break;
            }

            if(svc) {
                await svc.setGpsCoordinateOverride(media.id, gps);
                setGpsOverride(media.id, gps);
            }
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
        navigate(getMediaCategoryPath(params.categoryType as CategoryType, categoryId));
    }

    createEffect(() => {
        setMedia(mediaList.items.map(buildSelectableMedia));
    })

    return (
        <AdminGuard redirectRoute={getMediaPathByView(MediaViewModeGrid, params.categoryType as CategoryType, categoryId)}>
        <Layout toolbar={<Toolbar />} sidebar={
            <BulkEditSidebar
                onSave={onSave}
                onSelectAll={() => setAll(true)}
                onDeselectAll={() => setAll(false)}
                onHideMediaWithGps={onHideMediaWithGps} />
        }>
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
        </AdminGuard>
    );
};

export default ViewBulkEdit;
