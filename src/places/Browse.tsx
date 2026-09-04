import { Component, For, Match, Show, Switch, createEffect, createSignal } from "solid-js";
import { useNavigate, useParams, useSearchParams } from "@solidjs/router";

import { getPlacePath, PLACE_EDIT_PARAM } from "./_routes";
import { placeFeedBasePath } from "../_media/feed/_routes";
import { PlaceFilter, usePlacesContext } from "../_contexts/api/PlacesContext";
import { useAuthContext } from "../_contexts/AuthContext";
import { allPlaceKinds, isLeafPlace, Place, PlaceKind } from "../_models/Place";
import { firstParam } from "../_models/utils/RouteUtils";
import { isUuid, Uuid } from "../_models/Uuid";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import ErrorMessage from "../_components/error/ErrorMessage";
import Layout from "../_components/layout/Layout";
import PlaceCard from "./components/PlaceCard";
import PlaceChain from "./components/PlaceChain";
import PlaceCoverDialog from "./components/PlaceCoverDialog";
import PlaceMergeDialog from "./components/PlaceMergeDialog";
import PlaceMoveDialog from "./components/PlaceMoveDialog";
import PlaceSearchBar from "./components/PlaceSearchBar";
import SkeletonGrid from "../_components/loading/SkeletonGrid";
import Toolbar from "./components/Toolbar";
import { usePlaceChain } from "./usePlaceChain";

/*
   Browsing by where a photograph was taken, and - for an administrator with edit
   mode on - correcting the tree while looking at it.

   A drill-down rather than a list: countries, then their states, then their
   cities, with the photographs of a whole subtree one click away at every level.
   A place with nothing inside it goes straight to its photographs instead, so no
   tile leads to a page that only says there is nothing further down.

   Every listing is scoped to what the caller can see, so a place holding nothing
   visible to them is absent rather than empty. That is the whole read access
   story: there is no permission to check here, because a place the caller may not
   browse never arrives. Editing is different - it is offered on `isAdmin`, and
   then refused again by the API and by the database, which is what actually
   enforces it.
*/
const Browse: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [authContext] = useAuthContext();
    const { placesQuery, placeQuery } = usePlacesContext();

    // a route parameter matches on shape alone, so a typed url can hand this page
    // a segment that was never an id - treated as the root rather than requested
    // and refused
    const placeId = () => (isUuid(params.placeId) ? params.placeId : undefined);
    const search = () => (firstParam(searchParams.q) ?? "").trim();

    const kind = () => {
        const value = firstParam(searchParams.kind);

        return allPlaceKinds.find(k => k.id === value)?.id;
    };

    const isAdmin = () => !!authContext.accountStatus?.isAdmin;

    /*
       Edit mode. Read from the url so it survives a reload and can be linked, and
       gated on the account rather than on the parameter alone - a non-admin who
       types it gets the plain browse rather than buttons that would be refused.
    */
    const editing = () => isAdmin() && firstParam(searchParams[PLACE_EDIT_PARAM]) === "1";

    const toggleEditing = () =>
        setSearchParams({ [PLACE_EDIT_PARAM]: editing() ? undefined : "1" });

    const filter = (): PlaceFilter => ({
        parentId: placeId(),
        kind: kind(),
        search: search()
    });

    const places = placesQuery(filter);
    const place = placeQuery(placeId);
    const chain = usePlaceChain(placeId);

    /*
       The dialogs are held by id rather than by value, and the place is looked up
       again on every read. Choosing a cover patches the cached place, and that is
       how the dialog sees the copy it just published - it never has to track the
       result of its own write.
    */
    const [coverForId, setCoverForId] = createSignal<Uuid>();
    const [mergeIntoId, setMergeIntoId] = createSignal<Uuid>();
    const [moveId, setMoveId] = createSignal<Uuid>();

    /*
       A place with nothing inside it *is* its photographs, so its own page has
       nothing left to say - the chain names it, and the listing below would be
       empty. The tiles already skip it for that reason; this applies the same
       rule to the page, which is how a leaf is reached by a link, a bookmark, or
       by turning edit mode back off while standing on one.

       Replaced rather than pushed, so Back returns to the level the place was
       reached from rather than bouncing through the redirect.

       Not while editing - administering a leaf is done on this page, and it is
       the only way to reach its cover, its move and its merge. Not while a search
       or a filter is on either: those answer about the whole tree, and a redirect
       would throw the answer away.
    */
    createEffect(() => {
        if (!editing() && !search() && !kind() && place.data && isLeafPlace(place.data)) {
            navigate(placeFeedBasePath(place.data.id), { replace: true });
        }
    });

    const findPlace = (id: Uuid | undefined): Place | undefined => {
        if (!id) {
            return undefined;
        }

        return place.data?.id === id ? place.data : places.data?.find(p => p.id === id);
    };

    // every link that moves around the tree keeps the mode, so drilling in while
    // editing does not quietly drop back to the plain browse
    const treePath = (id?: Uuid) => getPlacePath(id, editing());

    const setSearch = (term: string) => setSearchParams({ q: term || undefined });
    const setKind = (value: PlaceKind | undefined) => setSearchParams({ kind: value });

    const kindLabel = () => allPlaceKinds.find(k => k.id === kind())?.name;

    /*
       A tile leads to whatever is actually inside it. At the bottom of the tree
       that is the photographs, so a city opens its feed rather than a page whose
       only content would be that there is nothing further down.

       `childCount` is what makes this possible, and it has to come from the API:
       a city having no children follows from its kind, but a state whose only
       cities sit in categories this caller cannot reach is just as much a leaf to
       them.

       Editing overrides it. A leaf still has a cover to choose and a duplicate to
       be merged into, and the panel holding those is on its own page - so while
       editing, every tile drills in.
    */
    const tileHref = (item: Place) =>
        !editing() && isLeafPlace(item) ? placeFeedBasePath(item.id) : treePath(item.id);

    /*
       The listing is left out entirely at a leaf rather than shown empty. Its
       heading and its tiles are the way further down, and there is no further
       down - the photographs are offered above, by the summary.

       A search or a kind filter keeps it, because there an empty answer is about
       what was asked for rather than about the place, and saying so is the point.
    */
    const showsChildren = () => {
        if (search() || kind() || !placeId()) {
            return true;
        }

        // once the listing has landed it is the truth, error included - a failure
        // belongs on screen rather than hidden as if the place were a leaf
        if (places.isSuccess) {
            return places.data.length > 0;
        }

        // until then the place itself already knows, and it lands first: without
        // this a city would flash a heading and a grid of skeletons on the way to
        // showing nothing
        return !place.data || !isLeafPlace(place.data);
    };

    // only ever read for a narrowed listing - see where it is rendered
    const listTitle = () =>
        search() ? `Places matching "${search()}"` : `${kindLabel() ?? "Places"} Here`;

    const emptyMessage = () => {
        const kindPhrase = kindLabel()?.toLocaleLowerCase() ?? "places";

        if (search()) {
            return `No ${kindPhrase} match that search.`;
        }

        /*
           A kind narrows the level being looked at rather than the tree, so
           asking for cities among the countries is a real question with an empty
           answer.
        */
        if (kind()) {
            return `There are no ${kindPhrase} at this level. The kind filter narrows the level you are on - search to look across the whole tree.`;
        }

        return "None of the media you can see has a location we recognised yet.";
    };

    return (
        <Layout
            toolbar={
                <Toolbar
                    placeId={placeId()}
                    canEdit={isAdmin()}
                    editing={editing()}
                    toggleEditing={toggleEditing}
                    chooseCover={() => setCoverForId(placeId())}
                    move={() => setMoveId(placeId())}
                    merge={() => setMergeIntoId(placeId())}
                />
            }
        >
            {/*
                Only at the root, where there is no chain to name the screen. Below
                it the strip says where you are, and a heading repeating "Places"
                above it would be a second answer to a question already answered.
            */}
            <Show when={!placeId()}>
                <h1 class="head1">Places</h1>
            </Show>

            <Show when={placeId()}>
                <PlaceChain links={chain()} buildPath={treePath} />
            </Show>

            {/*
                A place id in the path that answers 404 - a stale link, or a place
                that has since been merged away. The listing below it answers 200
                with nothing, which on its own reads as an empty place rather than
                a missing one.
            */}
            <Show when={placeId() && place.isError}>
                <ErrorMessage
                    title="Could not load this place"
                    error={place.error}
                    onRetry={() => void place.refetch()}
                />
            </Show>

            <PlaceSearchBar search={search()} kind={kind()} onSearch={setSearch} onKind={setKind} />

            <Show when={showsChildren()}>
                {/*
                    Only when something narrowed the listing. Unfiltered, the grid
                    under the chain is self-evidently what is inside the place the
                    chain ends on, and "Within This Place" was a label for a thing
                    that had just been said.
                */}
                <Show when={search() || kind()}>
                    <h2 class="text-lg font-bold">{listTitle()}</h2>
                </Show>

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
                                            href={tileHref(item)}
                                            leadsToMedia={!editing() && isLeafPlace(item)}
                                            showAncestry={!!search()}
                                            eager={idx() <= EAGER_THRESHOLD}
                                            onChooseCover={
                                                editing()
                                                    ? chosen => setCoverForId(chosen.id)
                                                    : undefined
                                            }
                                        />
                                    )}
                                </For>
                            </div>
                        </Show>
                    </Match>
                </Switch>
            </Show>

            {/*
                Mounted only for the people who can open them. They are closed
                until one of the buttons above sets its id, and those only exist
                in edit mode.
            */}
            <Show when={isAdmin()}>
                <PlaceCoverDialog
                    place={findPlace(coverForId())}
                    onClose={() => setCoverForId(undefined)}
                />

                <PlaceMergeDialog
                    place={findPlace(mergeIntoId())}
                    onClose={() => setMergeIntoId(undefined)}
                />

                <PlaceMoveDialog place={findPlace(moveId())} onClose={() => setMoveId(undefined)} />
            </Show>
        </Layout>
    );
};

export default Browse;
