import { Component, For } from "solid-js";

import {
    ThumbnailSizeIdType,
    defaultGridThumbnailSize,
    getThumbnailSize
} from "../../_models/ThumbnailSize";
import { STAGGER_LIMIT, STAGGER_STEP_MS } from "../../_models/utils/Constants";

interface Props {
    count?: number;
    thumbnailSize?: ThumbnailSizeIdType;
}

/*
   Placeholder tiles laid out on the same geometry as the real grid, so the
   content lands in place instead of shoving the page around when it arrives.
   Staggering the shimmer phase per tile avoids a single synchronised pulse.
*/
const SkeletonGrid: Component<Props> = props => {
    const size = () => getThumbnailSize(props.thumbnailSize ?? defaultGridThumbnailSize);
    const tiles = () => Array.from({ length: props.count ?? 24 }, (_, i) => i);

    return (
        <div class="mb-4" aria-hidden="true">
            <div class="skeleton-tile h-3 w-16 rounded-sm mt-3 mb-3" />

            <div class="flex gap-2 flex-wrap place-content-center">
                <For each={tiles()}>
                    {idx => (
                        <div
                            class="skeleton-tile rounded-sm border-1 border-secondary/20"
                            style={{
                                width: `${size().width}px`,
                                height: `${size().height}px`,
                                "animation-delay": `${Math.min(idx, STAGGER_LIMIT) * STAGGER_STEP_MS}ms`
                            }}
                        />
                    )}
                </For>
            </div>
        </div>
    );
};

export default SkeletonGrid;
