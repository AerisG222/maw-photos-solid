import { Component, For, Show, createEffect, createSignal } from "solid-js";

import { Media } from "../_models/Media";
import { GpsCoordinate } from "../_models/GpsCoordinate";
import { ThumbnailSizeDefault, getThumbnailSize } from "../_models/ThumbnailSize";
import { MediaViewGrid } from "../_models/MediaView";
import { Uuid } from "../_models/Uuid";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { IMapsMediaService } from "./services/IMapsMediaService";
import { useMediaContext } from "../_contexts/api/MediaContext";

import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import BulkEditSidebar from "./bulk-edit/BulkEditSidebar";
import AdminGuard from "../_components/auth/AdminGuard";

interface SelectableMedia {
    id: Uuid;
    isSelected: boolean;
    imageUrl: string;
}

interface Props {
    mediaService: IMapsMediaService;
}

const ViewBulkEdit: Component<Props> = props => {
    const { bulkGpsOverrideMutation } = useMediaContext(); // todo: add to service
    const [media, setMedia] = createSignal<SelectableMedia[]>([]);
    const [hideMediaWithGps, setHideMediaWithGps] = createSignal(false);

    const buildSelectableMedia = (media: Media) => ({
        id: media.id,
        imageUrl: getMediaTeaserUrl(media, ThumbnailSizeDefault)!,
        isSelected: false
    });

    const onSave = async (gps: GpsCoordinate) => {
        const mediaToUpdate = media()
            .filter(p => p.isSelected)
            .map(x => x.id);

        // assume success - make sure photos that may be removed from view are not still tracked as
        // participating in a future edit
        setAll(false);

        await bulkGpsOverrideMutation.mutateAsync({
            mediaIds: mediaToUpdate,
            gpsCoordinate: gps
        });
    };

    const setAll = (doSelect: boolean) => {
        setMedia(media =>
            media.map(m => {
                if (m.isSelected === doSelect) {
                    return m;
                }

                return { ...m, isSelected: doSelect };
            })
        );
    };

    const onHideMediaWithGps = (hide: boolean) => {
        setAll(false);
        setHideMediaWithGps(hide);
    };

    const toggle = (media: SelectableMedia) => {
        setMedia(prev =>
            prev.map(m => {
                if (m.id === media.id) {
                    return { ...m, isSelected: !m.isSelected };
                }

                return m;
            })
        );
    };

    createEffect(() => {
        setMedia(props.mediaService.getMediaList().map(buildSelectableMedia));
    });

    const mediaToShow = () => {
        if (!hideMediaWithGps()) {
            return media();
        } else {
            const mediaWithGps = new Set(props.mediaService.mediaWithGps().map(x => x.media.id));

            return media().filter(m => !mediaWithGps.has(m.id));
        }
    };

    return (
        <AdminGuard redirectRoute={props.mediaService.getEntryPathByView(MediaViewGrid)}>
            <Show when={props.mediaService.isReady()}>
                <Layout
                    toolbar={
                        <Toolbar
                            mediaService={props.mediaService}
                            activeCategory={props.mediaService.getActiveCategory()}
                            activeMedia={props.mediaService.getActiveMedia()}
                        />
                    }
                    sidebar={
                        <BulkEditSidebar
                            onSave={onSave}
                            onSelectAll={() => setAll(true)}
                            onDeselectAll={() => setAll(false)}
                            onHideMediaWithGps={onHideMediaWithGps}
                        />
                    }
                >
                    <CategoryBreadcrumb category={props.mediaService.getActiveCategory()} />

                    <div class="flex gap-2 flex-wrap place-content-center mb-4">
                        <For each={mediaToShow()}>
                            {m => (
                                <div
                                    class="border-1 border-primary/40 hover:border-primary cursor-pointer text-center rounded-sm"
                                    onClick={() => toggle(m)}
                                >
                                    <input
                                        type="checkbox"
                                        class="checkbox checkbox-sm my-1"
                                        checked={m.isSelected}
                                        onInput={evt => (m.isSelected = evt.currentTarget.checked)}
                                    />
                                    <img
                                        src={m.imageUrl}
                                        class="rounded-b-sm"
                                        width={getThumbnailSize(ThumbnailSizeDefault).width}
                                        height={getThumbnailSize(ThumbnailSizeDefault).height}
                                    />
                                </div>
                            )}
                        </For>
                    </div>
                </Layout>
            </Show>
        </AdminGuard>
    );
};

export default ViewBulkEdit;
