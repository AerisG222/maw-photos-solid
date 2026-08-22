import { Component, For, Show } from "solid-js";
import { UseQueryResult } from "@tanstack/solid-query";

import { Clan } from "../../_models/Clan";

import ClanCard from "./ClanCard";
import ErrorMessage from "../../_components/error/ErrorMessage";
import Icon from "../../_components/icon/Icon";

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
                <Show
                    when={(props.clans.data?.length ?? 0) > 0}
                    fallback={
                        <Show when={props.clans.isSuccess}>
                            <EmptyClans />
                        </Show>
                    }
                >
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
                </Show>
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
