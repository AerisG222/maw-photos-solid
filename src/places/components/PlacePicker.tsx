import { Component, For, Match, Show, Switch, createMemo, createSignal } from "solid-js";

import { usePlacesContext } from "../../_contexts/api/PlacesContext";
import { describePlaceAncestry, getPlaceKindName, Place, PlaceKind } from "../../_models/Place";
import { Uuid } from "../../_models/Uuid";

import ErrorMessage from "../../_components/error/ErrorMessage";
import Loading from "../../_components/loading/Loading";

interface Props {
    // which kinds may be picked. Applied here rather than by the API, which
    // takes a single kind - a move offers every level above the place, and the
    // whole tree is a few hundred nodes, so narrowing the answer costs nothing
    kinds: PlaceKind[];
    excludeIds: Uuid[];
    selected: Place | undefined;
    onSelect: (place: Place) => void;
}

/*
   Finds the *other* place a correction refers to - the duplicate to fold in, or
   the parent to move under.

   Searching rather than drilling, because the place being looked for is by
   definition somewhere the admin would not think to drill: the duplicates worth
   merging sit in different branches, and a place needing a new parent is in the
   wrong one. With nothing typed the API answers with the countries, which is
   where a re-parent usually starts.
*/
const PlacePicker: Component<Props> = props => {
    const { placesQuery } = usePlacesContext();
    const [term, setTerm] = createSignal("");
    const [search, setSearch] = createSignal("");

    const filter = () => ({
        parentId: undefined,
        kind: undefined,
        search: search()
    });

    // eslint-disable-next-line solid/reactivity -- an accessor, and the query re-keys itself when the term changes
    const places = placesQuery(filter);

    const matches = createMemo(() =>
        (places.data ?? []).filter(
            place => props.kinds.includes(place.kind) && !props.excludeIds.includes(place.id)
        )
    );

    return (
        <div class="flex flex-col gap-2">
            <div class="flex gap-2">
                <input
                    type="text"
                    placeholder="Find a Place"
                    class="input input-bordered input-sm grow"
                    value={term()}
                    onInput={evt => setTerm(evt.currentTarget.value)}
                    onKeyDown={evt => {
                        evt.stopPropagation();

                        if (evt.key === "Enter") {
                            setSearch(term().trim());
                        }
                    }}
                />

                <button
                    class="btn btn-sm btn-primary btn-outline"
                    title="Search"
                    onClick={() => setSearch(term().trim())}
                >
                    <span class="icon-[ic--round-search]" />
                </button>
            </div>

            <div class="h-64 overflow-y-auto border border-base-content/20 rounded-sm">
                <Switch fallback={<Loading />}>
                    <Match when={places.isError}>
                        <ErrorMessage
                            title="Could not load places"
                            error={places.error}
                            onRetry={() => void places.refetch()}
                        />
                    </Match>

                    <Match when={places.isSuccess}>
                        <Show
                            when={matches().length > 0}
                            fallback={<p class="text-center my-8">No places match that name.</p>}
                        >
                            <For each={matches()}>
                                {place => (
                                    <button
                                        class="flex w-full items-center gap-2 px-2 py-1 text-left cursor-pointer
                                            hover:bg-base-300"
                                        classList={{
                                            "bg-primary/10": place.id === props.selected?.id
                                        }}
                                        onClick={() => props.onSelect(place)}
                                    >
                                        <span class="min-w-0 grow">
                                            <span class="block truncate">{place.name}</span>

                                            <Show when={place.ancestorNames.length > 0}>
                                                <span class="block truncate text-xs opacity-70">
                                                    {describePlaceAncestry(place)}
                                                </span>
                                            </Show>
                                        </span>

                                        <span class="badge badge-sm opacity-70">
                                            {getPlaceKindName(place.kind)}
                                        </span>

                                        <span class="badge badge-sm opacity-70">
                                            {place.mediaCount}
                                        </span>
                                    </button>
                                )}
                            </For>
                        </Show>
                    </Match>
                </Switch>
            </div>
        </div>
    );
};

export default PlacePicker;
