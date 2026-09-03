import { Component, For, Match, Show, Switch, createSignal } from "solid-js";
import { useParams, useSearchParams } from "@solidjs/router";

import { PlaceFilter, usePlacesContext } from "../_contexts/api/PlacesContext";
import { allPlaceKinds, Place, PlaceKind } from "../_models/Place";
import { firstParam } from "../_models/utils/RouteUtils";
import { isUuid, Uuid } from "../_models/Uuid";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import ErrorMessage from "../_components/error/ErrorMessage";
import Layout from "../_components/layout/Layout";
import PlaceBreadcrumb from "./components/PlaceBreadcrumb";
import PlaceCard from "./components/PlaceCard";
import PlaceCoverDialog from "./components/PlaceCoverDialog";
import PlaceDetail from "./components/PlaceDetail";
import PlaceMergeDialog from "./components/PlaceMergeDialog";
import PlaceMoveDialog from "./components/PlaceMoveDialog";
import PlaceSearchBar from "./components/PlaceSearchBar";
import SkeletonGrid from "../_components/loading/SkeletonGrid";
import Toolbar from "./components/Toolbar";

/*
   Administering the place tree.

   One screen for the whole job rather than a list and a separate editor: the
   place you drill through is the place you administer, so the panel above the
   listing is always about the level the breadcrumb says you are on.

   Where you are and what you are searching for both live in the url - the level
   in the path, the term and the kind filter in the query - so a hunt for a
   duplicate survives a reload and can be handed to another tab.
*/
const Places: Component = () => {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { placesQuery, placeQuery, placeAncestorsQuery } = usePlacesContext();

    // a route parameter matches on shape alone, so a typed url can hand this
    // page a segment that was never an id - treated as the root rather than
    // requested and refused
    const placeId = () => (isUuid(params.placeId) ? params.placeId : undefined);
    const search = () => (firstParam(searchParams.q) ?? "").trim();

    const kind = () => {
        const value = firstParam(searchParams.kind);

        return allPlaceKinds.find(k => k.id === value)?.id;
    };

    const filter = (): PlaceFilter => ({
        parentId: placeId(),
        kind: kind(),
        search: search()
    });

    const places = placesQuery(filter);
    const place = placeQuery(placeId);
    const ancestors = placeAncestorsQuery(placeId);

    /*
       The dialogs are held by id rather than by value, and the place is looked
       up again on every read. Choosing a cover patches the cached place, and
       that is how the dialog sees the copy it just published - it never has to
       track the result of its own write.
    */
    const [coverForId, setCoverForId] = createSignal<Uuid>();
    const [mergeIntoId, setMergeIntoId] = createSignal<Uuid>();
    const [moveId, setMoveId] = createSignal<Uuid>();

    const findPlace = (id: Uuid | undefined): Place | undefined => {
        if (!id) {
            return undefined;
        }

        return place.data?.id === id ? place.data : places.data?.find(p => p.id === id);
    };

    // the chain includes the place itself, so its parent is the rung before it
    const parentId = () => {
        const chain = ancestors.data ?? [];

        return chain.length > 1 ? chain[chain.length - 2].id : undefined;
    };

    const setSearch = (term: string) => setSearchParams({ q: term || undefined });
    const setKind = (value: PlaceKind | undefined) => setSearchParams({ kind: value });

    // "Cities", to say what a filtered listing is a listing of
    const kindLabel = () => allPlaceKinds.find(k => k.id === kind())?.name;

    const listTitle = () => {
        if (search()) {
            return `Places matching "${search()}"`;
        }

        if (kindLabel()) {
            return `${kindLabel()!} Here`;
        }

        return placeId() ? "Within This Place" : "Countries";
    };

    const emptyMessage = () => {
        const kindPhrase = kindLabel()?.toLocaleLowerCase() ?? "places";

        if (search()) {
            return `No ${kindPhrase} match that search.`;
        }

        /*
           A kind narrows the level being looked at rather than the tree, so
           asking for cities among the countries is a real question with an empty
           answer. Worth saying, because the filter and the search sit next to
           each other and only one of them looks everywhere.
        */
        if (kind()) {
            return `There are no ${kindPhrase} at this level. The kind filter narrows the level you are on - search to look across the whole tree.`;
        }

        if (placeId()) {
            return "Nothing sits beneath this place.";
        }

        return "None of the media you can see has a location the geocoder recognised yet.";
    };

    return (
        <Layout toolbar={<Toolbar parentId={parentId()} atRoot={!placeId()} />}>
            <h1 class="head1">Places</h1>

            <PlaceBreadcrumb ancestors={ancestors.data ?? []} />

            {/*
                A place id in the path that answers 404 - a stale link, or a place
                that has since been merged away - is worth saying out loud. The
                listing below it answers 200 with nothing, which on its own reads
                as an empty place rather than a missing one.
            */}
            <Show when={placeId() && place.isError}>
                <ErrorMessage
                    title="Could not load this place"
                    error={place.error}
                    onRetry={() => void place.refetch()}
                />
            </Show>

            <Show when={place.data}>
                <PlaceDetail
                    place={place.data!}
                    onChooseCover={() => setCoverForId(place.data!.id)}
                    onMerge={() => setMergeIntoId(place.data!.id)}
                    onMove={() => setMoveId(place.data!.id)}
                />
            </Show>

            <PlaceSearchBar search={search()} kind={kind()} onSearch={setSearch} onKind={setKind} />

            <h2 class="text-lg font-bold">{listTitle()}</h2>

            <Show when={search()}>
                <p class="text-sm opacity-70 mb-2">
                    Searching every level of the tree, not just this one.
                </p>
            </Show>

            <Switch fallback={<SkeletonGrid />}>
                <Match when={places.isError}>
                    <ErrorMessage
                        title="Could not load places"
                        error={places.error}
                        onRetry={() => void places.refetch()}
                    />
                </Match>

                <Match when={places.isSuccess}>
                    <Show
                        when={places.data!.length > 0}
                        fallback={<p class="text-center my-8">{emptyMessage()}</p>}
                    >
                        <div class="flex gap-2 flex-wrap place-content-center mb-4 rise-in">
                            <For each={places.data}>
                                {(item, idx) => (
                                    <PlaceCard
                                        place={item}
                                        showAncestry={!!search()}
                                        eager={idx() <= EAGER_THRESHOLD}
                                        onChooseCover={chosen => setCoverForId(chosen.id)}
                                    />
                                )}
                            </For>
                        </div>
                    </Show>
                </Match>
            </Switch>

            <PlaceCoverDialog
                place={findPlace(coverForId())}
                onClose={() => setCoverForId(undefined)}
            />

            <PlaceMergeDialog
                place={findPlace(mergeIntoId())}
                onClose={() => setMergeIntoId(undefined)}
            />

            <PlaceMoveDialog place={findPlace(moveId())} onClose={() => setMoveId(undefined)} />
        </Layout>
    );
};

export default Places;
