import { Component, Show } from "solid-js";

import { Person } from "../../_models/Person";
import { getPersonPath } from "../_routes";
import { useListingSettingsContext } from "../../_contexts/settings/ListingSettingsContext";

import FavoriteBadge from "../../_components/listing/FavoriteBadge";
import Icon from "../../_components/icon/Icon";
import Tile from "../../_components/listing/Tile";

interface Props {
    person: Person;
    eager: boolean;
    // while people are being picked for a clan the card selects instead of
    // opening - it stays an anchor so its href still means something
    selectable: boolean;
    selected: boolean;
    setIsFavorite: (person: Person, isFavorite: boolean) => void;
    toggleSelected: (person: Person) => void;
}

const PersonCard: Component<Props> = props => {
    const [listing] = useListingSettingsContext();

    // an absolute url under /assets, like every media file - so the service
    // worker attaches the bearer token the crop is protected by, and this stays
    // a plain <img> with no auth handling of its own
    const faceUrl = () => props.person.preferredFaceUrl ?? undefined;

    const onClickFavorite = () => props.setIsFavorite(props.person, !props.person.isFavorite);

    const onClick = (evt: MouseEvent) => {
        if (props.selectable) {
            evt.preventDefault();

            props.toggleSelected(props.person);
        }
    };

    return (
        <Tile
            href={getPersonPath(props.person.id)}
            src={faceUrl()}
            square
            surface
            selected={props.selected}
            onClick={onClick}
            title={`${props.person.name} (${props.person.mediaCount})`}
            alt={props.person.name}
            eager={props.eager}
            placeholder={
                /* nobody has published a preferred face for them yet */
                <div class="col-span-full row-span-full flex items-center justify-center bg-base-300 text-base-content/40">
                    <Icon classes="icon-[ic--round-person] text-4xl" />
                </div>
            }
            label={<Show when={listing.showLabels}>{props.person.name}</Show>}
            badges={{
                topLeft: (
                    <Show when={props.selectable}>
                        <span
                            classList={{
                                "m-[2px] flex items-center justify-center w-[20px] h-[20px] rounded-full border": true,
                                "bg-primary text-primary-content border-primary": props.selected,
                                "bg-base-100/70 border-base-content/40": !props.selected
                            }}
                        >
                            <Show when={props.selected}>
                                <Icon classes="icon-[ic--round-check] text-sm" />
                            </Show>
                        </span>
                    </Show>
                ),
                /*
                   Always offered, unlike the badges elsewhere: this is the only
                   way to mark a person, so hiding it behind a preference would
                   hide the feature itself.
                */
                topRight: (
                    <FavoriteBadge
                        isFavorite={props.person.isFavorite}
                        subjectId={props.person.id}
                        onToggle={onClickFavorite}
                    />
                ),
                bottomRight: (
                    <Show when={listing.showLabels}>
                        <div class="badge badge-sm m-0.5 opacity-70">{props.person.mediaCount}</div>
                    </Show>
                )
            }}
        />
    );
};

export default PersonCard;
