import { Component, createMemo, createSignal, For, Match, Show, Switch } from "solid-js";

import { usePeopleContext } from "../_contexts/api/PeopleContext";
import { usePeopleGridViewSettingsContext } from "../_contexts/settings/PeopleGridViewSettingsContext";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";
import { Person } from "../_models/Person";
import { PersonSortName } from "../_models/PersonSort";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import ErrorMessage from "../_components/error/ErrorMessage";
import Layout from "../_components/layout/Layout";
import PersonCard from "./components/PersonCard";
import PersonFilterBar from "./components/PersonFilterBar";
import SkeletonGrid from "../_components/loading/SkeletonGrid";
import Toolbar from "./components/Toolbar";

const GridView: Component = () => {
    const [settings] = usePeopleGridViewSettingsContext();
    const { peopleQuery, setIsFavoriteMutation } = usePeopleContext();
    const [filter, setFilter] = createSignal("");

    const people = peopleQuery();

    /*
       Favorites lead either ordering, mirroring the list the API hands back.
       Marking someone is how a caller gets the handful of people they actually
       look for to the top, so it outranks whichever key they chose.
    */
    const byFavoriteFirst = (a: Person, b: Person) => Number(b.isFavorite) - Number(a.isFavorite);

    const byName = (a: Person, b: Person) => byFavoriteFirst(a, b) || a.name.localeCompare(b.name);

    // most photographed first, and alphabetical within a tie so the order does
    // not shuffle between renders
    const byMediaCount = (a: Person, b: Person) =>
        byFavoriteFirst(a, b) || b.mediaCount - a.mediaCount || a.name.localeCompare(b.name);

    const setIsFavorite = (person: Person, isFavorite: boolean) => {
        const req: IsFavoriteRequest<Person> = {
            item: person,
            isFavorite
        };

        setIsFavoriteMutation.mutate(req);
    };

    const peopleToDisplay = createMemo(() => {
        const term = filter().trim().toLocaleLowerCase();
        const all = people.data ?? [];
        const matches = term
            ? all.filter(person => person.name.toLocaleLowerCase().includes(term))
            : all;

        return [...matches].sort(settings.sortBy === PersonSortName ? byName : byMediaCount);
    });

    return (
        /*
           Layout wraps every state, not just the loaded one - see the note in the
           categories grid: it owns the backdrop and toolbar, and both are driven
           by settings alone, so they are safe to show while the list is in flight.
        */
        <Layout toolbar={<Toolbar />} margin={settings.margin} title="People">
            <Switch fallback={<SkeletonGrid thumbnailSize={settings.thumbnailSize} />}>
                <Match when={people.isError}>
                    <ErrorMessage
                        title="Could not load people"
                        error={people.error}
                        onRetry={() => void people.refetch()}
                    />
                </Match>

                <Match when={people.isSuccess}>
                    <Show when={people.data!.length > 0} fallback={<EmptyLibrary />}>
                        <PersonFilterBar filter={filter()} setFilter={setFilter} />

                        <Show when={peopleToDisplay().length > 0} fallback={<NoMatches />}>
                            <div class="flex gap-2 flex-wrap place-content-center mb-4 rise-in">
                                <For each={peopleToDisplay()}>
                                    {(person, idx) => (
                                        <PersonCard
                                            person={person}
                                            showName={settings.showNames}
                                            showMediaCount={settings.showMediaCounts}
                                            thumbnailSize={settings.thumbnailSize}
                                            dimThumbnails={settings.dimThumbnails}
                                            eager={idx() <= EAGER_THRESHOLD}
                                            setIsFavorite={setIsFavorite}
                                        />
                                    )}
                                </For>
                            </div>
                        </Show>
                    </Show>
                </Match>
            </Switch>
        </Layout>
    );
};

const EmptyLibrary: Component = () => (
    <p class="text-center my-8">
        Nobody has been identified in the photos and videos you can see yet. Once faces have been
        recognised, everyone found will show up here.
    </p>
);

const NoMatches: Component = () => <p class="text-center my-8">No people match that name.</p>;

export default GridView;
