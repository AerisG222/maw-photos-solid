import { Component, For, Show } from "solid-js";

import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";
import { getThumbnailSize, ThumbnailSizeSmall } from "../../_models/ThumbnailSize";
import { Media } from "../../_models/Media";
import { Uuid } from "../../_models/Uuid";

import Icon from "../../_components/icon/Icon";

interface Props {
    items: Media[];
    // the media the current cover was published from, shown as the choice in
    // effect. It cannot be read from the cover url, which names the copy
    coverMediaId: Uuid | null | undefined;
    disabled: boolean;
    onChoose: (media: Media) => void;
}

/*
   The photographs a place's cover may be published from.

   Shared by both ways of finding one - the place's whole feed, and the media of
   a single category taken there - so the tile, the selected marker and the
   click that publishes are defined once.
*/
const CoverCandidateGrid: Component<Props> = props => {
    const size = () => getThumbnailSize(ThumbnailSizeSmall);

    return (
        <div class="flex gap-2 flex-wrap place-content-center">
            <For each={props.items}>
                {item => (
                    <button
                        class="relative border-1 rounded-sm overflow-hidden cursor-pointer
                            hover:border-primary disabled:cursor-wait"
                        classList={{
                            "border-primary": item.id === props.coverMediaId,
                            "border-transparent": item.id !== props.coverMediaId
                        }}
                        style={{
                            width: `${size().width}px`,
                            height: `${size().height}px`
                        }}
                        disabled={props.disabled}
                        title="Publish as the cover"
                        onClick={() => props.onChoose(item)}
                    >
                        <img
                            src={getMediaTeaserUrl(item, ThumbnailSizeSmall)}
                            class="block w-full h-full object-cover"
                            loading="lazy"
                        />

                        <Show when={item.id === props.coverMediaId}>
                            <span
                                class="absolute top-0 right-0 m-0.5 flex items-center justify-center
                                    w-5 h-5 rounded-full bg-primary text-primary-content"
                            >
                                <Icon classes="icon-[ic--round-check] text-sm" />
                            </span>
                        </Show>
                    </button>
                )}
            </For>
        </div>
    );
};

export default CoverCandidateGrid;
