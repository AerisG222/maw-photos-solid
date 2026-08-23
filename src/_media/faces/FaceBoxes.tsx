import { Component, createMemo, createSignal, For, Show } from "solid-js";
import { createElementSize } from "@solid-primitives/resize-observer";

import { FaceHighlight } from "./useFaceHighlight";

interface Props {
    highlight: FaceHighlight;
}

/*
   The boxes themselves, drawn over the image.

   Rendered inside the element that carries the rotate and flip transform, so a
   turned or mirrored photo takes its boxes with it rather than needing the same
   arithmetic done twice.

   Nothing here takes pointer events: the image underneath handles swipes, taps
   and - in the grid - a click that opens the photo, and a face sitting in the
   middle of the frame would otherwise swallow all three. Pointing at a person
   is done from the strip instead.
*/
const FaceBoxes: Component<Props> = props => {
    const [el, setEl] = createSignal<HTMLDivElement>();
    const size = createElementSize(el);

    /*
       Where the photo actually is inside its box. `object-contain` letterboxes
       the image, so the normalised coordinates are relative to the painted area
       rather than to the element - which are the same thing only when the two
       aspect ratios happen to match.
    */
    const painted = createMemo(() => {
        const natural = props.highlight.natural();
        const boxWidth = size.width ?? 0;
        const boxHeight = size.height ?? 0;

        if (!natural || boxWidth === 0 || boxHeight === 0) {
            return undefined;
        }

        const scale = Math.min(boxWidth / natural.width, boxHeight / natural.height);
        const width = natural.width * scale;
        const height = natural.height * scale;

        return {
            width,
            height,
            left: (boxWidth - width) / 2,
            top: (boxHeight - height) / 2
        };
    });

    return (
        /*
           Clipped to the photo's own box. A detector reports a face cut off by
           the frame edge with coordinates slightly outside 0..1, and a name
           label is wider than the face it belongs to - either would otherwise
           push past the stage and raise a scrollbar. Clipping is also what the
           photo does to those faces, so the boxes agree with the image.
        */
        <div ref={setEl} class="absolute inset-0 overflow-hidden pointer-events-none">
            <Show when={painted()}>
                <For each={props.highlight.highlighted()}>
                    {entry => {
                        const area = () => painted()!;
                        const isActive = () =>
                            !!entry.person && props.highlight.activePersonId() === entry.person.id;

                        return (
                            <div
                                class="absolute rounded-sm transition-[border-color,box-shadow,opacity] duration-200 ease-out"
                                classList={{
                                    // an unassigned face is real but nameless, so
                                    // it is marked more quietly and dashed
                                    "border-2": true,
                                    "border-dashed": !entry.person,
                                    "border-base-100/60": !entry.person,
                                    "border-primary": !!entry.person && isActive(),
                                    "shadow-[0_0_0_2px_rgba(0,0,0,0.35)]": isActive(),
                                    "border-base-100/80": !!entry.person && !isActive(),
                                    // dim the others once one person is singled out
                                    "opacity-40": !!props.highlight.activePersonId() && !isActive(),
                                    "opacity-100": !props.highlight.activePersonId() || isActive()
                                }}
                                style={{
                                    left: `${area().left + entry.face.boxX * area().width}px`,
                                    top: `${area().top + entry.face.boxY * area().height}px`,
                                    width: `${entry.face.boxWidth * area().width}px`,
                                    height: `${entry.face.boxHeight * area().height}px`
                                }}
                            >
                                <Show when={entry.person && isActive()}>
                                    <span class="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap rounded-sm bg-primary text-primary-content text-xs px-1 py-[1px]">
                                        {entry.person!.name}
                                    </span>
                                </Show>
                            </div>
                        );
                    }}
                </For>
            </Show>
        </div>
    );
};

export default FaceBoxes;
