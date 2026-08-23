import { Component, createEffect, For, Match, Show, Switch } from "solid-js";
import { UseQueryResult } from "@tanstack/solid-query";

import { Clan } from "../../_models/Clan";
import { KEY_UI_CLAN_COUNT, loadJson, saveJson } from "../../_contexts/settings/_storage";

import ClanCard from "./ClanCard";
import ClanSkeleton from "./ClanSkeleton";
import ErrorMessage from "../../_components/error/ErrorMessage";
import Icon from "../../_components/icon/Icon";

interface ClanCountHint {
    count: number;
}

// enough to be worth reserving on a first visit, small enough that being wrong
// costs little either way
const DEFAULT_PLACEHOLDERS = 2;
const MAX_PLACEHOLDERS = 4;

interface Props {
    clans: UseQueryResult<Clan[], Error>;
    onCreate: () => void;
    onEditMembers: (clan: Clan) => void;
    onRename: (clan: Clan) => void;
    onDelete: (clan: Clan) => void;
}

/*
   Sits above the people, because a clan is the shortcut a returning user is
   most likely to want - the full face grid is the long way round.
*/
const ClanSection: Component<Props> = props => {
    /*
       How many placeholders to draw. The clan list is consistently slower than
       the people below it - the API counts each member's media once per clan
       they are in - so this section reserves its space from what it needed last
       time rather than appearing late and pushing the grid down.

       Read once, on purpose: this is about the height to hold before the answer
       arrives, and it must not change while that is being waited for.
    */
    const hinted = loadJson<ClanCountHint>(KEY_UI_CLAN_COUNT, {
        count: DEFAULT_PLACEHOLDERS
    }).count;

    // a remembered zero is meaningful - somebody with no clans should not be
    // shown cards that then vanish - so it is kept, while a missing or damaged
    // hint falls back
    const placeholders = Math.min(
        Number.isInteger(hinted) && hinted >= 0 ? hinted : DEFAULT_PLACEHOLDERS,
        MAX_PLACEHOLDERS
    );

    createEffect(() => {
        if (props.clans.isSuccess) {
            saveJson<ClanCountHint>(KEY_UI_CLAN_COUNT, { count: props.clans.data.length });
        }
    });

    return (
        <div class="mb-4">
            <div class="flex flex-row items-center justify-center gap-3 my-2">
                <h2 class="head2 m-0">Clans</h2>

                <button class="btn btn-sm btn-primary btn-outline" onClick={() => props.onCreate()}>
                    <Icon classes="icon-[ic--round-add]" />
                    New Clan
                </button>
            </div>

            {/*
                A failed clan list is reported inline and nothing more: the people
                below it loaded independently and are still perfectly usable.
            */}
            <Show when={!props.clans.isError} fallback={<ClanLoadError clans={props.clans} />}>
                <Switch>
                    <Match when={props.clans.isPending}>
                        <ClanSkeleton count={placeholders} />
                    </Match>

                    <Match when={(props.clans.data?.length ?? 0) > 0}>
                        <div class="flex gap-2 flex-wrap place-content-center">
                            <For each={props.clans.data}>
                                {clan => (
                                    <ClanCard
                                        clan={clan}
                                        onEditMembers={props.onEditMembers}
                                        onRename={props.onRename}
                                        onDelete={props.onDelete}
                                    />
                                )}
                            </For>
                        </div>
                    </Match>

                    <Match when={props.clans.isSuccess}>
                        <EmptyClans />
                    </Match>
                </Switch>
            </Show>
        </div>
    );
};

const EmptyClans: Component = () => (
    <p class="text-center text-sm opacity-70">
        Group the people you look for together - say "the kids" - and they are one click away.
    </p>
);

const ClanLoadError: Component<{ clans: UseQueryResult<Clan[], Error> }> = props => (
    <ErrorMessage
        title="Could not load clans"
        error={props.clans.error}
        onRetry={() => void props.clans.refetch()}
    />
);

export default ClanSection;
