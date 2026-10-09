import { Component, Show } from "solid-js";
import { Dialog as KobalteDialog } from "@kobalte/core/dialog";

import { Media } from "../_models/Media";
import { getMainMediaUrl } from "../_models/utils/MediaUtils";
import { useConfigContext } from "../_contexts/api/ConfigContext";

import Icon from "../_components/icon/Icon";

interface Props {
    // what is open, or undefined when the preview is closed
    media: Media | undefined;
    onClose: () => void;
}

/*
   A closer look at the photo picked on the map, over the map rather than in
   place of it - so closing it leaves the map where it was, zoom and all.

   The rendition is the one the detail view would show at this window size, as
   in bulk edit's preview.
*/
const MapMediaPreview: Component<Props> = props => {
    const { getScalesForMain } = useConfigContext();

    return (
        <KobalteDialog
            open={!!props.media}
            onOpenChange={open => {
                if (!open) {
                    props.onClose();
                }
            }}
        >
            <KobalteDialog.Portal>
                <KobalteDialog.Overlay class="fixed inset-0 z-50 bg-black/80" />

                <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <KobalteDialog.Content class="bg-base-100 rounded-box p-4 elev-overlay flex flex-col max-h-full max-w-full outline-none">
                        <Show when={props.media}>
                            {media => (
                                <>
                                    <div class="flex items-baseline gap-4">
                                        <KobalteDialog.Title class="head3 m-0 truncate">
                                            {media().slug}
                                        </KobalteDialog.Title>
                                        <KobalteDialog.CloseButton
                                            class="btn btn-sm btn-circle btn-ghost ml-auto shrink-0"
                                            aria-label="Close preview"
                                        >
                                            <Icon classes="icon-[ic--round-close] text-lg" />
                                        </KobalteDialog.CloseButton>
                                    </div>

                                    <div class="mt-3 min-h-0 flex items-center justify-center">
                                        <Show
                                            when={media().type === "video"}
                                            fallback={
                                                <img
                                                    src={getMainMediaUrl(
                                                        media(),
                                                        getScalesForMain()
                                                    )}
                                                    alt=""
                                                    class="max-h-[80dvh] max-w-full object-contain rounded-sm"
                                                />
                                            }
                                        >
                                            <video
                                                src={getMainMediaUrl(media(), getScalesForMain())}
                                                controls
                                                class="max-h-[80dvh] max-w-full rounded-sm"
                                            />
                                        </Show>
                                    </div>
                                </>
                            )}
                        </Show>
                    </KobalteDialog.Content>
                </div>
            </KobalteDialog.Portal>
        </KobalteDialog>
    );
};

export default MapMediaPreview;
