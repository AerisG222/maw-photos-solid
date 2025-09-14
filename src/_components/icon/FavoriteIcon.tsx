import { Component } from "solid-js";

import Icon from "./Icon";

interface Props {
    isFavorite: boolean;
}

const FavoriteIcon: Component<Props> = props => {
    const favoriteIconClass = () => {
        const klass = [];

        if (props.isFavorite) {
            klass.push("icon-[mdi--heart]");
            klass.push("hover:icon-[mdi--heart-outline]");
        } else {
            klass.push("icon-[mdi--heart-outline]");
            klass.push("hover:icon-[mdi--heart]");
        }

        return klass.join(" ");
    };

    return <Icon classes={favoriteIconClass()} />;
};

export default FavoriteIcon;
