import { Component, For, Show } from "solid-js";
import { A } from "@solidjs/router";

import { getPlaceKindIcon, PlaceKind } from "../../_models/Place";
import { Uuid } from "../../_models/Uuid";

import Icon from "../../_components/icon/Icon";

/*
   One rung of the chain. Built by the caller rather than derived here, because
   the two halves come from different reads: the names and the order from the
   ancestors endpoint, which always answers, and the cover and count from each
   place, which arrive later or not at all.
*/
export interface PlaceChainLink {
    id: Uuid;
    name: string;
    kind: PlaceKind;
    // undefined until the place behind the rung has loaded, and null when its
    // admin has never chosen one - which is most of them, so the icon is the
    // normal case rather than the fallback
    coverUrl: string | null | undefined;
    mediaCount: number | undefined;
}

interface Props {
    links: PlaceChainLink[];
    buildPath: (id?: Uuid) => string;
}

/*
   Where in the tree the screen is, as the tree rather than as a sentence.

   This replaced a text breadcrumb and the panel that used to sit under it. The
   panel showed the current place's cover, name and count; the breadcrumb showed
   the names above it; between them they said the same thing twice and cost half
   the height of the screen. One strip does both: every rung is a jump, and the
   last one carries what the panel used to.

   Chips with a thumbnail rather than the picture cards the tiles below use.
   Covers are hand picked and most places have none yet, so a strip of cards would
   be a row of empty frames - this way a rung reads as its name with a picture
   when there is one, and gets richer on its own as covers are chosen.
*/
const PlaceChain: Component<Props> = props => {
    const isCurrent = (index: number) => index === props.links.length - 1;

    return (
        <div class="flex flex-wrap items-center gap-1 my-3">
            <A
                class="flex items-center gap-1 px-2 py-1 rounded-sm border border-secondary/20
                    hover:border-primary hover:text-primary transition-colors duration-150 ease-out"
                href={props.buildPath()}
            >
                <Icon classes="icon-[ic--round-travel-explore] text-lg" />
                <span class="text-sm">All Places</span>
            </A>

            <For each={props.links}>
                {(link, idx) => (
                    <>
                        <Icon classes="icon-[ic--round-chevron-right] text-lg opacity-40" />

                        {/*
                            The rung you are on is a link too. It is where a merge
                            or a move that reshaped the chain gets read again, and
                            it costs nothing to leave working.
                        */}
                        <A
                            class="flex items-center gap-2 pr-2 rounded-sm border
                                transition-colors duration-150 ease-out"
                            classList={{
                                "border-secondary/20 hover:border-primary hover:text-primary":
                                    !isCurrent(idx()),
                                "border-primary bg-primary/10 font-bold": isCurrent(idx())
                            }}
                            href={props.buildPath(link.id)}
                            title={link.name}
                        >
                            <Show
                                when={link.coverUrl}
                                fallback={
                                    <span class="flex items-center justify-center w-10 aspect-4/3 rounded-l-sm bg-base-300 text-base-content/50">
                                        <Icon
                                            classes={`${getPlaceKindIcon(link.kind)} text-base`}
                                        />
                                    </span>
                                }
                            >
                                <img
                                    src={link.coverUrl!}
                                    alt=""
                                    class="w-10 aspect-4/3 object-cover rounded-l-sm"
                                />
                            </Show>

                            <span class="text-sm">{link.name}</span>

                            {/* only on the rung you are on: the others are a path, not a subject */}
                            <Show when={isCurrent(idx()) && link.mediaCount !== undefined}>
                                <span class="badge badge-sm opacity-70">{link.mediaCount}</span>
                            </Show>
                        </A>
                    </>
                )}
            </For>
        </div>
    );
};

export default PlaceChain;
