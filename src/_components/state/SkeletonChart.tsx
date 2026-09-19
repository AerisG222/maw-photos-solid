import { Component, For } from "solid-js";

import { STAGGER_LIMIT, STAGGER_STEP_MS } from "../../_models/utils/Constants";

interface Props {
    bars?: number;
}

/*
   The chart-shaped counterpart to SkeletonGrid - see the note there. Stats was
   the one area that showed a centered spinner while it waited, which says
   "something is happening" where the others say "a chart is coming, and it will
   be about this big".
*/
const SkeletonChart: Component<Props> = props => {
    const bars = () => Array.from({ length: props.bars ?? 12 }, (_, i) => i);
    // a shape that reads as data rather than as a flat block
    const height = (idx: number) => 35 + ((idx * 37) % 60);

    return (
        <div class="mb-4" aria-hidden="true">
            <div class="skeleton-tile h-3 w-32 rounded-sm mt-3 mb-6" />

            <div class="flex items-end justify-center gap-2 h-64">
                <For each={bars()}>
                    {idx => (
                        <div
                            class="skeleton-tile w-8 rounded-sm"
                            style={{
                                height: `${height(idx)}%`,
                                "animation-delay": `${Math.min(idx, STAGGER_LIMIT) * STAGGER_STEP_MS}ms`
                            }}
                        />
                    )}
                </For>
            </div>
        </div>
    );
};

export default SkeletonChart;
