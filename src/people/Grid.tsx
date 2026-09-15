import { Component, createMemo, createSignal, Show } from "solid-js";
import ListingSurface from "../_components/listing/ListingSurface";

import { useClansContext } from "../_contexts/api/ClansContext";
import { usePeopleContext } from "../_contexts/api/PeopleContext";
import { useListingSettingsContext } from "../_contexts/settings/ListingSettingsContext";
import { Clan } from "../_models/Clan";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";
import { Person } from "../_models/Person";
import { PersonSortName } from "../_models/PersonSort";
import { Uuid } from "../_models/Uuid";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import ClanNameDialog from "./components/ClanNameDialog";
import ConfirmDialog from "../_components/overlay/ConfirmDialog";
import ClanSection from "./components/ClanSection";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import Layout from "../_components/layout/Layout";
import PersonCard from "./components/PersonCard";
import PersonFilterBar from "./components/PersonFilterBar";
import SelectionBar from "./components/SelectionBar";
import EmptyState from "../_components/state/EmptyState";
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
    const [listing] = useListingSettingsContext();
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
        const term = filter().trim().toLocaleLowerCase();
        const all = people.data ?? [];
        const matches = term
            ? all.filter(person => person.name.toLocaleLowerCase().includes(term))
            : all;

        return [...matches].sort(listing.peopleSort === PersonSortName ? byName : byMediaCount);
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
        <Layout margin toolbar={<Toolbar />}>
            <AsyncBoundary
                queries={[people]}
                errorTitle="Could not load people"
                when={people.isSuccess}
                skeleton={<SkeletonGrid />}
                isEmpty={people.data?.length === 0}
                empty={<EmptyLibrary />}
            >
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
                        submitLabel={picking().kind === "create" ? "Name Clan" : "Save People"}
                        canSubmit={picking().kind !== "create" || selected().size > 0}
                        pending={setClanPersonsMutation.isPending}
                        onSubmit={submitPicking}
                        onClear={() => setSelected(new Set<Uuid>())}
                        onCancel={stopPicking}
                    />
                </Show>

                <PersonFilterBar filter={filter()} setFilter={setFilter} />

                <Show when={peopleToDisplay().length > 0} fallback={<NoMatches />}>
                    <ListingSurface animate class="mb-4" items={peopleToDisplay()}>
                        {(person, index) => (
                            <PersonCard
                                person={person}
                                eager={index <= EAGER_THRESHOLD}
                                selectable={isPicking()}
                                selected={selected().has(person.id)}
                                setIsFavorite={setIsFavorite}
                                toggleSelected={toggleSelected}
                            />
                        )}
                    </ListingSurface>
                </Show>
            </AsyncBoundary>

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

            <ConfirmDialog
                open={!!deleting()}
                title="Delete Clan"
                confirmLabel="Delete"
                destructive
                pending={deleteClanMutation.isPending}
                error={
                    deleteClanMutation.error
                        ? "The clan could not be deleted. Please try again."
                        : undefined
                }
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            >
                Delete <span class="font-bold">{deleting()?.name}</span>? The people in it are left
                alone - only the grouping goes away.
            </ConfirmDialog>
        </Layout>
    );
};

const EmptyLibrary: Component = () => (
    <EmptyState
        icon="icon-[ic--round-people]"
        title="Nobody has been identified yet"
        detail="Once faces have been recognised in the photos and videos you can see, everyone found will show up here."
    />
);

const NoMatches: Component = () => (
    <EmptyState icon="icon-[ic--round-search-off]" title="No people match that name" />
);

export default GridView;
