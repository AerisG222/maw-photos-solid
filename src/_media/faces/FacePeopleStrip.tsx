import { Component, For, Show } from "solid-js";

import { FaceHighlight } from "./useFaceHighlight";
import { Person } from "../../_models/Person";

import Icon from "../../_components/icon/Icon";

interface Props {
    highlight: FaceHighlight;
}

/*
   Who is in this photo, as a row of faces along the bottom.

   Deliberately outside the transformed element the boxes live in: rotating the
   photo should not stand the controls on their head. Hovering one picks its box
   out of the crowd; tapping pins it, which is the same gesture where there is no
   hover to be had.
*/
const FacePeopleStrip: Component<Props> = props => {
    const isActive = (person: Person) => props.highlight.activePersonId() === person.id;

    return (
        <Show when={props.highlight.peopleInMedia().length > 0}>
            {/*
                Centred by a full width flex row rather than by left-1/2 and a
                transform. The transform moves the strip visually but leaves its
                layout box running from the middle of the photo to beyond the
                right edge, and the stage sets overflow-y, which makes the
                browser compute overflow-x to auto as well - so that overhang
                turned into a horizontal scrollbar and carried the faces off the
                page with it.

                The row takes no pointer events, so an invisible full width bar
                cannot swallow the swipes and clicks belonging to the photo.
            */}
            <div class="absolute inset-x-0 bottom-0 mb-2 z-20 flex justify-center pointer-events-none">
                {/*
                    A crowded photo can hold more faces than fit across the
                    screen, so the strip scrolls within itself rather than
                    widening past the frame
                */}
                <div class="flex flex-row gap-1 max-w-full overflow-x-auto rounded-full bg-base-100/80 px-2 py-1 shadow-md pointer-events-auto">
                    <For each={props.highlight.peopleInMedia()}>
                        {person => (
                            <button
                                class="shrink-0 rounded-full cursor-pointer transition-transform duration-150 ease-out"
                                classList={{
                                    "ring-2 ring-primary scale-110": isActive(person),
                                    "hover:scale-110": !isActive(person)
                                }}
                                title={person.name}
                                aria-label={person.name}
                                onMouseEnter={() => props.highlight.setHovered(person.id)}
                                onMouseLeave={() => props.highlight.setHovered(undefined)}
                                onFocus={() => props.highlight.setHovered(person.id)}
                                onBlur={() => props.highlight.setHovered(undefined)}
                                onClick={evt => {
                                    // the grid wraps the photo in a link to the
                                    // full view, which this must not trigger
                                    evt.preventDefault();
                                    evt.stopPropagation();

                                    props.highlight.togglePinned(person.id);
                                }}
                            >
                                <Show
                                    when={person.preferredFaceUrl}
                                    fallback={
                                        <span class="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-base-300 text-base-content/50">
                                            <Icon classes="icon-[ic--round-person]" />
                                        </span>
                                    }
                                >
                                    <img
                                        src={person.preferredFaceUrl!}
                                        alt={person.name}
                                        class="w-[32px] h-[32px] rounded-full object-cover block"
                                        loading="lazy"
                                    />
                                </Show>
                            </button>
                        )}
                    </For>
                </div>
            </div>
        </Show>
    );
};

export default FacePeopleStrip;
