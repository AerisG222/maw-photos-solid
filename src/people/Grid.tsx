import { Component, createMemo, createSignal, For, Match, Show, Switch } from "solid-js";

import { useClansContext } from "../_contexts/api/ClansContext";
import { usePeopleContext } from "../_contexts/api/PeopleContext";
import { usePeopleGridViewSettingsContext } from "../_contexts/settings/PeopleGridViewSettingsContext";
import { Clan } from "../_models/Clan";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";
import { Person } from "../_models/Person";
import { PersonSortName } from "../_models/PersonSort";
import { Uuid } from "../_models/Uuid";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import ClanDeleteDialog from "./components/ClanDeleteDialog";
import ClanNameDialog from "./components/ClanNameDialog";
import ClanSection from "./components/ClanSection";
import ErrorMessage from "../_components/error/ErrorMessage";
import Layout from "../_components/layout/Layout";
import PersonCard from "./components/PersonCard";
import PersonFilterBar from "./components/PersonFilterBar";
import SelectionBar from "./components/SelectionBar";
import SkeletonGrid from "../_components/loading/SkeletonGrid";
import Toolbar from "./components/Toolbar";

/*
   What the face grid is currently being used for. Picking people is a mode
   rather than a separate screen, so the filter and sort that make someone
   findable are the same ones used to assemble a clan.
*/
type Picking =
    | { kind: "off" }
    | { kind: "create" }
    // the clan being edited, held so the bar can name it and the save knows
    // where to go
    | { kind: "members"; clan: Clan };

const GridView: Component = () => {
    const [settings] = usePeopleGridViewSettingsContext();
    const { peopleQuery, setIsFavoriteMutation } = usePeopleContext();
    const {
        clansQuery,
        createClanMutation,
        renameClanMutation,
        setClanPersonsMutation,
        deleteClanMutation
    } = useClansContext();

    const [filter, setFilter] = createSignal("");
    const [picking, setPicking] = createSignal<Picking>({ kind: "off" });
    const [selected, setSelected] = createSignal<Set<Uuid>>(new Set());
    const [naming, setNaming] = createSignal<"off" | "create" | "rename">("off");
    const [renaming, setRenaming] = createSignal<Clan | undefined>();
    const [deleting, setDeleting] = createSignal<Clan | undefined>();

    const people = peopleQuery();
    const clans = clansQuery();

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
        // eslint-disable-next-line solid/reactivity -- read by the filter below, which runs now rather than later
        const term = filter().trim().toLocaleLowerCase();
        const all = people.data ?? [];
        const matches = term
            ? all.filter(person => person.name.toLocaleLowerCase().includes(term))
            : all;

        return [...matches].sort(settings.sortBy === PersonSortName ? byName : byMediaCount);
    });

    const isPicking = () => picking().kind !== "off";

    const toggleSelected = (person: Person) => {
        // replaced rather than mutated so the grid sees the change
        setSelected(prev => {
            const next = new Set(prev);

            if (!next.delete(person.id)) {
                next.add(person.id);
            }

            return next;
        });
    };

    const startCreate = () => {
        setSelected(new Set<Uuid>());
        setPicking({ kind: "create" });
    };

    const startEditMembers = (clan: Clan) => {
        // seeded with who is already in it, so the same interaction adds and
        // removes: what is selected when the bar is saved is the membership
        setSelected(new Set(clan.members.map(member => member.id)));
        setPicking({ kind: "members", clan });
    };

    const stopPicking = () => {
        setPicking({ kind: "off" });
        setSelected(new Set<Uuid>());
    };

    const selectedIds = () => [...selected()];

    const submitPicking = () => {
        const current = picking();

        if (current.kind === "create") {
            // the name is asked for last: it is easier to name a group once you
            // can see who is in it
            setNaming("create");

            return;
        }

        if (current.kind === "members") {
            setClanPersonsMutation.mutate(
                { id: current.clan.id, personIds: selectedIds() },
                { onSuccess: stopPicking }
            );
        }
    };

    const submitName = (name: string) => {
        if (naming() === "create") {
            createClanMutation.mutate(
                { name, personIds: selectedIds() },
                {
                    onSuccess: () => {
                        setNaming("off");
                        stopPicking();
                    }
                }
            );

            return;
        }

        const clan = renaming();

        if (clan) {
            renameClanMutation.mutate(
                { id: clan.id, name },
                {
                    onSuccess: () => {
                        setNaming("off");
                        setRenaming(undefined);
                    }
                }
            );
        }
    };

    const cancelName = () => {
        setNaming("off");
        setRenaming(undefined);
        createClanMutation.reset();
        renameClanMutation.reset();
    };

    const startRename = (clan: Clan) => {
        setRenaming(clan);
        setNaming("rename");
    };

    const confirmDelete = () => {
        const clan = deleting();

        if (clan) {
            deleteClanMutation.mutate(clan.id, {
                onSuccess: () => setDeleting(undefined)
            });
        }
    };

    const cancelDelete = () => {
        setDeleting(undefined);
        deleteClanMutation.reset();
    };

    const pickingTitle = () => {
        const current = picking();

        return current.kind === "members" ? `Members of ${current.clan.name}` : "New clan";
    };

    return (
        /*
           Layout wraps every state, not just the loaded one - see the note in the
           categories grid: it owns the backdrop and toolbar, and both are driven
           by settings alone, so they are safe to show while the list is in flight.
        */
        <Layout toolbar={<Toolbar />} margin={settings.margin}>
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
                        <Show
                            when={isPicking()}
                            fallback={
                                <ClanSection
                                    clans={clans}
                                    onCreate={startCreate}
                                    onEditMembers={startEditMembers}
                                    onRename={startRename}
                                    onDelete={setDeleting}
                                />
                            }
                        >
                            <SelectionBar
                                title={pickingTitle()}
                                selectedCount={selected().size}
                                submitLabel={
                                    picking().kind === "create" ? "Name Clan" : "Save People"
                                }
                                canSubmit={picking().kind !== "create" || selected().size > 0}
                                pending={setClanPersonsMutation.isPending}
                                onSubmit={submitPicking}
                                onClear={() => setSelected(new Set<Uuid>())}
                                onCancel={stopPicking}
                            />
                        </Show>

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
                                            selectable={isPicking()}
                                            selected={selected().has(person.id)}
                                            setIsFavorite={setIsFavorite}
                                            toggleSelected={toggleSelected}
                                        />
                                    )}
                                </For>
                            </div>
                        </Show>
                    </Show>
                </Match>
            </Switch>

            <ClanNameDialog
                open={naming() !== "off"}
                title={naming() === "rename" ? "Rename Clan" : "Name Your Clan"}
                submitLabel={naming() === "rename" ? "Save" : "Create"}
                initialName={renaming()?.name ?? ""}
                memberCount={naming() === "create" ? selected().size : undefined}
                pending={createClanMutation.isPending || renameClanMutation.isPending}
                error={createClanMutation.error ?? renameClanMutation.error}
                onSubmit={submitName}
                onCancel={cancelName}
            />

            <ClanDeleteDialog
                clan={deleting()}
                pending={deleteClanMutation.isPending}
                error={deleteClanMutation.error}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
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
