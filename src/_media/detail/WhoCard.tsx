import { Component, For, Match, Show, Switch, createMemo } from "solid-js";
import { A } from "@solidjs/router";

import { useMediaContext } from "../../_contexts/api/MediaContext";
import { usePeopleContext } from "../../_contexts/api/PeopleContext";
import { Media } from "../../_models/Media";
import { getPersonPath } from "../../people/_routes";
import { peopleInFaces } from "../faces/_peopleInFaces";

import ErrorMessage from "../../_components/error/ErrorMessage";
import Icon from "../../_components/icon/Icon";
import Loading from "../../_components/loading/Loading";

interface Props {
    activeMedia: Media | undefined;
}

/*
   Who is in a photograph.

   The faces were already found and named - but the only way to see them was the
   face overlay, which draws boxes and a strip of people *over the photograph*,
   and only while highlighting is switched on. So finding out who was in a
   picture meant covering it. This lists them beside it instead, each name
   leading to everything else that person is in.

   The two answer the same question differently and share how it is answered -
   see _peopleInFaces - so the overlay and this card cannot disagree about who
   counts.
*/
const WhoCard: Component<Props> = props => {
    const { facesQuery } = useMediaContext();
    const { peopleQuery } = usePeopleContext();

    const mediaId = () => props.activeMedia?.id;
    // eslint-disable-next-line solid/reactivity -- an accessor, and the query re-keys itself when the photo changes
    const faces = facesQuery(mediaId);
    const people = peopleQuery();

    const found = createMemo(() => peopleInFaces(faces.data ?? [], people.data ?? []));

    const unidentifiedLabel = () => {
        const count = found().unidentified;

        return `${count} ${count === 1 ? "face" : "faces"} not yet named`;
    };

    return (
        <Switch fallback={<Loading />}>
            <Match when={faces.isError || people.isError}>
                <ErrorMessage
                    title="Could not load who is in this photograph"
                    error={faces.error ?? people.error}
                    onRetry={() => {
                        void faces.refetch();
                        void people.refetch();
                    }}
                />
            </Match>

            <Match when={faces.isSuccess && people.isSuccess}>
                <Show
                    when={found().people.length > 0 || found().unidentified > 0}
                    fallback={
                        <p class="text-sm text-muted">Nobody was found in this photograph.</p>
                    }
                >
                    <ul class="flex flex-col gap-1" aria-label="People in this photograph">
                        <For each={found().people}>
                            {person => (
                                <li>
                                    <A
                                        href={getPersonPath(person.id)}
                                        class="flex items-center gap-2 rounded-field px-2 py-1 hover:bg-base-300 hover:text-primary"
                                    >
                                        <Show
                                            when={person.preferredFaceUrl}
                                            fallback={
                                                <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-base-300">
                                                    <Icon classes="icon-[ic--round-person]" />
                                                </span>
                                            }
                                        >
                                            <img
                                                src={person.preferredFaceUrl!}
                                                // the name is printed beside it
                                                alt=""
                                                class="size-8 shrink-0 rounded-full object-cover"
                                            />
                                        </Show>

                                        <span class="min-w-0 grow truncate">{person.name}</span>
                                    </A>
                                </li>
                            )}
                        </For>
                    </ul>

                    {/*
                        Counted rather than hidden: a face the detector found but
                        nobody has named is a prompt to go and name it, and
                        leaving it out would make the list look complete when it
                        is not.
                    */}
                    <Show when={found().unidentified > 0}>
                        <p class="mt-2 px-2 text-sm text-muted">{unidentifiedLabel()}</p>
                    </Show>
                </Show>
            </Match>
        </Switch>
    );
};

export default WhoCard;
