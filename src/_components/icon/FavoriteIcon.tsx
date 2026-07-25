import { Component, createEffect, createSignal } from "solid-js";

import { Uuid } from "../../_models/Uuid";
import { claimFavoritePulse } from "./_favoritePulse";

import Icon from "./Icon";

interface Props {
    isFavorite: boolean;
    // the item this heart represents; without it the icon simply never pops
    subjectId?: Uuid;
    extraClasses?: string;
}

const FavoriteIcon: Component<Props> = props => {
    const [popping, setPopping] = createSignal(false);

    // celebrate the save, not the click - fires once the mutation has confirmed
    // and the refreshed value is on screen
    createEffect(() => {
        if (claimFavoritePulse(props.subjectId)) {
            setPopping(true);
        }
    });

    const favoriteIconClass = () => {
        const klass = [];

        if (props.isFavorite) {
            klass.push("icon-[mdi--heart]");
            // klass.push("hover:icon-[mdi--heart-outline]");
        } else {
            klass.push("icon-[mdi--heart-outline]");
            // klass.push("hover:icon-[mdi--heart]");
        }

        if (props.extraClasses) {
            klass.push(props.extraClasses);
        }

        return klass.join(" ");
    };

    return (
        // the animation lives on a wrapper so `onAnimationEnd` can clear the
        // class, which is what lets a repeat save restart the animation
        <span
            classList={{ "inline-block": true, "align-middle": true, "heart-pop": popping() }}
            onAnimationEnd={() => setPopping(false)}
        >
            <Icon classes={favoriteIconClass()} />
        </span>
    );
};

export default FavoriteIcon;
