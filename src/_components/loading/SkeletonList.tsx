import { Component, For } from "solid-js";

import {
    ThumbnailSizeIdType,
    defaultListThumbnailSize,
    getThumbnailSize
} from "../../_models/ThumbnailSize";
import { STAGGER_LIMIT, STAGGER_STEP_MS } from "../../_models/utils/Constants";

interface Props {
    count?: number;
    thumbnailSize?: ThumbnailSizeIdType;
}

// list-shaped counterpart to SkeletonGrid - see the note there
const SkeletonList: Component<Props> = props => {
    const size = () => getThumbnailSize(props.thumbnailSize ?? defaultListThumbnailSize);
    const rows = () => Array.from({ length: props.count ?? 12 }, (_, i) => i);

    return (
        <div class="mb-4" aria-hidden="true">
            <div class="skeleton-tile h-3 w-16 rounded-sm mt-3 mb-3" />

            <For each={rows()}>
                {idx => (
                    <div class="flex items-center gap-3 p-1 border-b-1 border-b-secondary/10">
                        <div
                            class="skeleton-tile shrink-0 rounded-sm"
                            style={{
                                width: `${size().width}px`,
                                height: `${size().height}px`,
                                "animation-delay": `${Math.min(idx, STAGGER_LIMIT) * STAGGER_STEP_MS}ms`
                            }}
                        />
                        <div
                            class="skeleton-tile h-3 rounded-sm grow max-w-64"
                            style={{
                                "animation-delay": `${Math.min(idx, STAGGER_LIMIT) * STAGGER_STEP_MS}ms`
                            }}
                        />
                    </div>
                )}
            </For>
        </div>
    );
};

export default SkeletonList;
