import { Component, For, Show } from "solid-js";

import { Clan } from "../../_models/Clan";
import { Person } from "../../_models/Person";

import Icon from "../../_components/icon/Icon";

// enough faces to recognise the clan at a glance; the rest are counted
const FACES_SHOWN = 5;

interface Props {
    clan: Clan;
    onEditMembers: (clan: Clan) => void;
    onRename: (clan: Clan) => void;
    onDelete: (clan: Clan) => void;
}

const MemberFace: Component<{ person: Person }> = props => (
    <Show
        when={props.person.preferredFaceUrl}
        fallback={
            <span
                class="w-[36px] h-[36px] rounded-full bg-base-300 text-base-content/40 flex items-center justify-center border-1 border-base-100"
                title={props.person.name}
            >
                <Icon classes="icon-[ic--round-person]" />
            </span>
        }
    >
        <img
            src={props.person.preferredFaceUrl!}
            alt={props.person.name}
            title={props.person.name}
            class="w-[36px] h-[36px] rounded-full object-cover border-1 border-base-100"
            loading="lazy"
        />
    </Show>
);

const ClanCard: Component<Props> = props => {
    const shown = () => props.clan.members.slice(0, FACES_SHOWN);
    const hidden = () => Math.max(0, props.clan.members.length - FACES_SHOWN);

    const memberSummary = () => {
        const count = props.clan.members.length;

        return count === 1 ? "1 person" : `${count} people`;
    };

    return (
        <div class="flex flex-col gap-2 border-1 rounded-sm bg-base-200 border-secondary/20 p-3 min-w-[220px]">
            <div class="flex items-baseline gap-2">
                <span class="font-bold truncate">{props.clan.name}</span>
                <span class="text-sm opacity-70">{memberSummary()}</span>
            </div>

            <Show
                when={props.clan.members.length > 0}
                fallback={
                    /*
                       Either nobody was ever added, or the members are no longer
                       visible to this user - the API cannot tell the two apart
                       without leaking who it dropped, so neither can this
                    */
                    <p class="text-sm opacity-70">No people in this clan yet.</p>
                }
            >
                {/* -space-x pulls the faces into an overlapping row */}
                <div class="flex flex-row -space-x-2">
                    <For each={shown()}>{person => <MemberFace person={person} />}</For>

                    <Show when={hidden() > 0}>
                        <span class="w-[36px] h-[36px] rounded-full bg-base-300 border-1 border-base-100 text-xs flex items-center justify-center">
                            +{hidden()}
                        </span>
                    </Show>
                </div>
            </Show>

            <div class="flex flex-row gap-1">
                <button
                    class="btn btn-xs btn-outline btn-primary"
                    title="Choose who belongs to this clan"
                    onClick={() => props.onEditMembers(props.clan)}
                >
                    <Icon classes="icon-[ic--round-group-add]" />
                    People
                </button>
                <button
                    class="btn btn-xs btn-outline"
                    title="Rename this clan"
                    onClick={() => props.onRename(props.clan)}
                >
                    <Icon classes="icon-[ic--round-edit]" />
                    Rename
                </button>
                <button
                    class="btn btn-xs btn-outline btn-error"
                    title="Delete this clan"
                    onClick={() => props.onDelete(props.clan)}
                >
                    <Icon classes="icon-[ic--round-delete]" />
                </button>
            </div>
        </div>
    );
};

export default ClanCard;
