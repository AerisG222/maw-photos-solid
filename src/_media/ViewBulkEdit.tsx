import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

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
import { BulkEditGpsFilter } from "./bulk-edit/BulkEditFilterCard";
import ConfirmDialog from "../_components/overlay/ConfirmDialog";
import AdminGuard from "../_components/auth/AdminGuard";
import { usePanelShape } from "../_components/overlay/SidePanel";

interface SelectableMedia {
    id: Uuid;
    isSelected: boolean;
    imageUrl: string;
}

interface Props {
    mediaService: IMapsMediaService;
}

const ViewBulkEdit: Component<Props> = props => {
    const { bulkGpsOverrideMutation, bulkClearGpsOverrideMutation } = useMediaContext(); // todo: add to service
    const { docked } = usePanelShape();
    const navigate = useNavigate();

    /*
       The one view that is not offered on a narrow screen.

       Everything here is "pick photographs, then type one set of coordinates
       for all of them", which means having the selection and the form in view
       at once. Where the panel cannot dock it comes over the grid instead, so
       entering a location means covering the very thing you chose it for.

       The toolbar stops offering it, and this catches the rest: a bookmarked
       URL, a link from elsewhere, or a window dragged narrower while it is
       open. Same shape as the AdminGuard above it - leave, rather than render
       something that cannot do its job.
    */
    createEffect(() => {
        if (!docked()) {
            navigate(props.mediaService.getEntryPathByView(MediaViewGrid), { replace: true });
        }
    });
    const [media, setMedia] = createSignal<SelectableMedia[]>([]);
    const [gpsFilter, setGpsFilter] = createSignal<BulkEditGpsFilter>("all");
    const [isConfirmingClear, setIsConfirmingClear] = createSignal(false);

    const buildSelectableMedia = (media: Media) => ({
        id: media.id,
        imageUrl: getMediaTeaserUrl(media)!,
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

    const selectedIds = () =>
        media()
            .filter(m => m.isSelected)
            .map(m => m.id);

    const onConfirmClearOverride = async () => {
        const mediaToClear = selectedIds();

        // as with a save: the cleared photos may leave the "with an override" view
        setAll(false);
        setIsConfirmingClear(false);

        await bulkClearGpsOverrideMutation.mutateAsync({ mediaIds: mediaToClear });
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

    // only what is on screen - with the gps filter on, the hidden photos already
    // have a location, and selecting them would overwrite it on the next save
    const selectAllShown = () => {
        const shown = new Set(mediaToShow().map(m => m.id));

        setMedia(media =>
            media.map(m => (shown.has(m.id) && !m.isSelected ? { ...m, isSelected: true } : m))
        );
    };

    const onGpsFilterChange = (filter: BulkEditGpsFilter) => {
        setAll(false);
        setGpsFilter(filter);
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
        const filter = gpsFilter();

        if (filter === "all") {
            return media();
        }

        const withGps = props.mediaService.mediaWithGps();

        if (filter === "withoutGps") {
            const ids = new Set(withGps.map(x => x.media.id));

            return media().filter(m => !ids.has(m.id));
        }

        const ids = new Set(withGps.filter(x => x.gps.override).map(x => x.media.id));

        return media().filter(m => ids.has(m.id));
    };

    return (
        <AdminGuard redirectRoute={props.mediaService.getEntryPathByView(MediaViewGrid)}>
            <Show when={props.mediaService.isReady() && docked()}>
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
                            onSelectAll={selectAllShown}
                            onDeselectAll={() => setAll(false)}
                            onClearOverride={() => setIsConfirmingClear(true)}
                            selectedCount={selectedIds().length}
                            gpsFilter={gpsFilter()}
                            onGpsFilterChange={onGpsFilterChange}
                        />
                    }
                >
                    <CategoryBreadcrumb category={props.mediaService.getActiveCategory()} />

                    <div class="listing-flow mb-4">
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
                                        /* the checkbox beside it carries the meaning */
                                        alt=""
                                        class="rounded-b-sm"
                                        width={getThumbnailSize(ThumbnailSizeDefault).width}
                                        height={getThumbnailSize(ThumbnailSizeDefault).height}
                                    />
                                </div>
                            )}
                        </For>
                    </div>

                    <ConfirmDialog
                        open={isConfirmingClear()}
                        title="Clear GPS Override"
                        confirmLabel="Clear"
                        destructive
                        onConfirm={() => void onConfirmClearOverride()}
                        onCancel={() => setIsConfirmingClear(false)}
                    >
                        Remove the GPS override from {selectedIds().length} selected{" "}
                        {selectedIds().length === 1 ? "photo" : "photos"}? Each will go back to the
                        location its file recorded, if it has one.
                    </ConfirmDialog>
                </Layout>
            </Show>
        </AdminGuard>
    );
};

export default ViewBulkEdit;
