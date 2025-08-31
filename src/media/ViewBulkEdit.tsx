import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";

import { Media } from "../_models/Media";
import { GpsCoordinate } from "../_models/GpsCoordinate";
import { MediaViewModeGrid, categoryBulkEditRoute, getMediaPathByView } from "./_routes";
import { ThumbnailSizeDefault, getThumbnailSize } from "../_models/ThumbnailSize";

import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import BulkEditSidebar from "./bulk-edit/BulkEditSidebar";
import AdminGuard from "../_components/auth/AdminGuard";

type SelectableMedia = {
    id: Uuid;
    isSelected: boolean;
    imageUrl: string;
    latitude?: number;
    longitude?: number;
};

const ViewBulkEdit: Component = () => {
    const [media, setMedia] = createSignal<SelectableMedia[]>([]);
    const [hideMediaWithGps, setHideMediaWithGps] = createSignal(false);
    const params = useParams();
    const categoryId = params.categoryId as Uuid;

    // setActiveRouteDefinition(categoryBulkEditRoute);

    const buildSelectableMedia = (media: Media) => ({
        id: media.id,
        kind: "kind",
        imageUrl: "todo", //getMediaTeaserUrl(media),
        latitude: 0, //media.latitude,
        longitude: 0, //media.longitude,
        isSelected: false
    });

    const onSave = async (gps: GpsCoordinate) => {
        const mediaToUpdate = media().filter(p => p.isSelected);

        // assume success - make sure photos that may be removed from view are not still tracked as
        // participating in a future edit
        setAll(false);

        for (const media of mediaToUpdate) {
            //await mediaService.setGpsCoordinateOverride(media.id, gps);
            // setGpsOverride(media.id, gps);
        }

        // if (categoryService && categoryState.activeCategory) {
        //     var category = await categoryService.loadSingle(categoryState.activeCategory.id);

        //     updateCategory(category);
        // }
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
                if (m.imageUrl === media.imageUrl) {
                    return { ...m, isSelected: !m.isSelected };
                }

                return m;
            })
        );
    };

    createEffect(() => {
        // setMedia(mediaList.items.map(buildSelectableMedia));
    });

    return (
        <AdminGuard redirectRoute={getMediaPathByView(MediaViewModeGrid, categoryId)}>
            {/* <Show when={mediaList.activeRouteDefinition}> */}
            <Layout
                // toolbar={<Toolbar />}
                sidebar={
                    <BulkEditSidebar
                        onSave={onSave}
                        onSelectAll={() => setAll(true)}
                        onDeselectAll={() => setAll(false)}
                        onHideMediaWithGps={onHideMediaWithGps}
                    />
                }
            >
                <CategoryBreadcrumb />

                <div class="flex flex-wrap gap-2 mx-8 mb-2 flex-justify-center">
                    <For each={media()}>
                        {m => (
                            <Show when={hideMediaWithGps() ? !m.latitude && !m.longitude : true}>
                                <div
                                    class="border-1 border-text-primary:40 hover:border-text-primary cursor-pointer text-center bg-secondary-content:6"
                                    onClick={() => toggle(m)}
                                >
                                    <input
                                        type="checkbox"
                                        class="checkbox checkbox-sm mt-1"
                                        checked={m.isSelected}
                                        onInput={evt => (m.isSelected = evt.currentTarget.checked)}
                                    />
                                    <img
                                        src={m.imageUrl}
                                        width={getThumbnailSize(ThumbnailSizeDefault).width}
                                        height={getThumbnailSize(ThumbnailSizeDefault).height}
                                    />
                                </div>
                            </Show>
                        )}
                    </For>
                </div>
            </Layout>
            {/* </Show> */}
        </AdminGuard>
    );
};

export default ViewBulkEdit;
