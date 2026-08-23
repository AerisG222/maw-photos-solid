import { Accessor, createEffect, createMemo, createSignal, on, onCleanup } from "solid-js";

import { useMediaContext } from "../../_contexts/api/MediaContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { DetectedFace } from "../../_models/DetectedFace";
import { Media } from "../../_models/Media";
import { Person } from "../../_models/Person";
import { Uuid } from "../../_models/Uuid";

export interface HighlightedFace {
    face: DetectedFace;
    // absent while a face is unassigned, or when the person is not one this
    // caller can see - the box is still drawn, just anonymously
    person: Person | undefined;
}

/*
   The state behind face highlighting: which faces are in the current media, who
   they belong to, and which one the user is pointing at.

   Owned here rather than in the components because the boxes and the person
   strip live in different parts of the DOM - the boxes sit inside the element
   carrying the rotate and flip transform, so they turn with the photo, while
   the strip stays upright outside it - and the two have to agree on what is
   highlighted.
*/
export const useFaceHighlight = (
    media: Accessor<Media | undefined>,
    element: Accessor<HTMLImageElement | HTMLVideoElement | undefined>,
    // the hosting view's own setting - grid, detail and fullscreen each keep
    // their own, so this hook is told rather than looking it up
    enabled: Accessor<boolean>
) => {
    const { facesQuery } = useMediaContext();
    const { peopleQuery } = usePeopleContext();

    const [hovered, setHovered] = createSignal<Uuid | undefined>();
    // touch has no hover, so a tap keeps a person highlighted until tapped again
    const [pinned, setPinned] = createSignal<Uuid | undefined>();
    const [natural, setNatural] = createSignal<{ width: number; height: number }>();

    const isEnabled = () => enabled();

    // nothing is fetched until the mode is switched on, so the overlay costs
    // exactly nothing for the people who never use it
    const mediaId = () => (isEnabled() ? media()?.id : undefined);

    const faces = facesQuery(mediaId);

    // gated for the same reason: this hook mounts with every photo in the app,
    // and the person list is only ever read to name a highlighted face
    const people = peopleQuery(isEnabled);

    const activePersonId = () => hovered() ?? pinned();

    const highlighted = createMemo<HighlightedFace[]>(() => {
        const detected = faces.data ?? [];

        return detected.map(face => ({
            face,
            person: face.personId
                ? people.data?.find(person => person.id === face.personId)
                : undefined
        }));
    });

    /*
       One entry per person, in the order their first face appears, so the strip
       does not repeat somebody photographed twice in the same frame.
    */
    const peopleInMedia = createMemo(() => {
        const seen = new Map<Uuid, Person>();

        for (const entry of highlighted()) {
            if (entry.person && !seen.has(entry.person.id)) {
                seen.set(entry.person.id, entry.person);
            }
        }

        return [...seen.values()];
    });

    /*
       The source dimensions, which the normalised boxes are relative to. Read
       from the element rather than the API: it is the only thing that knows what
       actually loaded, and a scaled file keeps the aspect of its source.
    */
    createEffect(() => {
        const el = element();

        if (!el) {
            return;
        }

        const read = () => {
            const width = el instanceof HTMLImageElement ? el.naturalWidth : el.videoWidth;
            const height = el instanceof HTMLImageElement ? el.naturalHeight : el.videoHeight;

            if (width > 0 && height > 0) {
                setNatural({ width, height });
            }
        };

        // already decoded when the mode is switched on mid-view, and not yet
        // when the media has just changed - so both are covered
        read();

        el.addEventListener("load", read);
        el.addEventListener("loadedmetadata", read);

        onCleanup(() => {
            el.removeEventListener("load", read);
            el.removeEventListener("loadedmetadata", read);
        });
    });

    // a new photo invalidates the previous one's dimensions and any highlight.
    // `on` states the dependency outright, which a bare read of the id - the only
    // thing this needs from the media - would not
    createEffect(
        on(
            () => media()?.id,
            () => {
                setNatural(undefined);
                setHovered(undefined);
                setPinned(undefined);
            },
            { defer: true }
        )
    );

    const togglePinned = (personId: Uuid) =>
        setPinned(prev => (prev === personId ? undefined : personId));

    return {
        isEnabled,
        isLoading: () => faces.isPending,
        highlighted,
        peopleInMedia,
        activePersonId,
        natural,
        setHovered,
        togglePinned
    };
};

export type FaceHighlight = ReturnType<typeof useFaceHighlight>;
