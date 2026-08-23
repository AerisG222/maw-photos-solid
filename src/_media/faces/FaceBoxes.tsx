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

   The layer takes no pointer events, so the image underneath keeps the whole
   frame for swipes and taps. The identified boxes do take them, which is what
   lets a face be pointed at directly - and costs nothing, because they sit
   inside the element those gestures are bound to and inside the link the grid
   wraps the photo in, so both still see the events by bubbling.

   An unassigned face stays inert: there is nobody to highlight.
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
                                onMouseEnter={() =>
                                    entry.person && props.highlight.setHovered(entry.person.id)
                                }
                                onMouseLeave={() => props.highlight.setHovered(undefined)}
                                classList={{
                                    // an unassigned face is real but nameless, so
                                    // it is marked more quietly and dashed
                                    "border-2": true,
                                    "pointer-events-auto": !!entry.person,
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
                                {/* the point of identifying somebody is saying who they are */}
                                <Show when={entry.person}>
                                    <span
                                        class="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap rounded-sm text-xs px-1 py-[1px]"
                                        classList={{
                                            "bg-primary text-primary-content": isActive(),
                                            // the one being pointed at speaks up;
                                            // the rest stay quiet so a crowded
                                            // photo does not shout
                                            "bg-base-100/80": !isActive()
                                        }}
                                    >
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
