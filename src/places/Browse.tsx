import { Component, For, Match, Show, Switch } from "solid-js";
import { useNavigate, useParams, useSearchParams } from "@solidjs/router";

import { getPlaceAdminPath, getPlacePath } from "./_routes";
import { placeFeedBasePath } from "../_media/feed/_routes";
import { PlaceFilter, usePlacesContext } from "../_contexts/api/PlacesContext";
import { useAuthContext } from "../_contexts/AuthContext";
import { allPlaceKinds, PlaceKind } from "../_models/Place";
import { firstParam } from "../_models/utils/RouteUtils";
import { isUuid } from "../_models/Uuid";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import ErrorMessage from "../_components/error/ErrorMessage";
import Layout from "../_components/layout/Layout";
import PlaceBreadcrumb from "./components/PlaceBreadcrumb";
import PlaceCard from "./components/PlaceCard";
import PlaceSearchBar from "./components/PlaceSearchBar";
import PlaceSummary from "./components/PlaceSummary";
import PlaceTreeToolbar from "./components/PlaceTreeToolbar";
import SkeletonGrid from "../_components/loading/SkeletonGrid";
import ToolbarButton from "../_components/toolbar/ToolbarButton";

/*
   Browsing by where a photograph was taken.

   A drill-down rather than a list: countries, then their states, then their
   cities, with the photographs of a whole subtree one click away at every level -
   a country's feed holds everything in its states and their cities, so the tree
   is a way of narrowing rather than a set of dead ends.

   Every listing is scoped to what the caller can see, so a place holding nothing
   visible to them is absent rather than empty. That is the whole access story
   here: there is no permission to check in the client, because a place the caller
   may not browse never arrives.
*/
const Browse: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [authContext] = useAuthContext();
    const { placesQuery, placeQuery, placeAncestorsQuery } = usePlacesContext();

    // a route parameter matches on shape alone, so a typed url can hand this page
    // a segment that was never an id - treated as the root rather than requested
    // and refused
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

    // the chain includes the place itself, so its parent is the rung before it
    const parentId = () => {
        const chain = ancestors.data ?? [];

        return chain.length > 1 ? chain[chain.length - 2].id : undefined;
    };

    const setSearch = (term: string) => setSearchParams({ q: term || undefined });
    const setKind = (value: PlaceKind | undefined) => setSearchParams({ kind: value });

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
           answer.
        */
        if (kind()) {
            return `There are no ${kindPhrase} at this level. The kind filter narrows the level you are on - search to look across the whole tree.`;
        }

        // the common one: a city has nothing inside it, and the photographs are
        // the point of having drilled this far
        if (placeId()) {
            return "Nothing sits inside this place - its photos and videos are above.";
        }

        return "None of the media you can see has a location we recognised yet.";
    };

    return (
        <Layout
            toolbar={
                <PlaceTreeToolbar
                    parentId={parentId()}
                    atRoot={!placeId()}
                    buildPath={getPlacePath}
                >
                    <ToolbarButton
                        icon="icon-[ic--round-image]"
                        name="Photos"
                        tooltip="Photos and Videos Taken Here"
                        shortcutKeys={["p"]}
                        disabled={!placeId()}
                        clickHandler={() => navigate(placeFeedBasePath(placeId()!))}
                    />

                    {/*
                        The same tree, with the corrections attached. Offered only
                        to the people who can actually change anything - every
                        write behind it is refused for everybody else.
                    */}
                    <Show when={authContext.accountStatus?.isAdmin}>
                        <ToolbarButton
                            icon="icon-[ic--round-edit]"
                            name="Administer"
                            tooltip="Administer These Places"
                            shortcutKeys={["e"]}
                            clickHandler={() => navigate(getPlaceAdminPath(placeId()))}
                        />
                    </Show>
                </PlaceTreeToolbar>
            }
        >
            <h1 class="head1">Places</h1>

            <PlaceBreadcrumb ancestors={ancestors.data ?? []} />

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

            <Show when={place.data}>
                <PlaceSummary place={place.data!} />
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
                                        href={getPlacePath(item.id)}
                                        showAncestry={!!search()}
                                        eager={idx() <= EAGER_THRESHOLD}
                                    />
                                )}
                            </For>
                        </div>
                    </Show>
                </Match>
            </Switch>
        </Layout>
    );
};

export default Browse;
