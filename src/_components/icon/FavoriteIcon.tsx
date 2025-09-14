import { Component } from "solid-js";

import Icon from "./Icon";

interface Props {
    isFavorite: boolean;
    extraClasses?: string;
}

const FavoriteIcon: Component<Props> = props => {
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

    return <Icon classes={favoriteIconClass()} />;
};

export default FavoriteIcon;
