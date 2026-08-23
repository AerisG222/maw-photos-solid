import { Component, For } from "solid-js";

import { STAGGER_STEP_MS } from "../../_models/utils/Constants";

interface Props {
    count: number;
}

/*
   Placeholder clan cards, laid out on the same geometry as the real ones so the
   people grid below starts in the right place and stays there when the clans
   land.
*/
const ClanSkeleton: Component<Props> = props => {
    const cards = () => Array.from({ length: props.count }, (_, i) => i);
    const faces = [0, 1, 2];

    return (
        <div class="flex gap-2 flex-wrap place-content-center" aria-hidden="true">
            <For each={cards()}>
                {card => (
                    <div class="flex flex-col gap-2 border-1 rounded-sm bg-base-200 border-secondary/20 p-3 min-w-[220px]">
                        <div
                            class="skeleton-tile h-4 w-32 rounded-sm"
                            style={{ "animation-delay": `${card * STAGGER_STEP_MS}ms` }}
                        />

                        <div class="flex flex-row -space-x-2">
                            <For each={faces}>
                                {face => (
                                    <span
                                        class="skeleton-tile w-[36px] h-[36px] rounded-full border-1 border-base-100"
                                        style={{
                                            "animation-delay": `${(card + face) * STAGGER_STEP_MS}ms`
                                        }}
                                    />
                                )}
                            </For>
                        </div>

                        <div
                            class="skeleton-tile h-6 w-40 rounded-sm"
                            style={{ "animation-delay": `${card * STAGGER_STEP_MS}ms` }}
                        />
                    </div>
                )}
            </For>
        </div>
    );
};

export default ClanSkeleton;
