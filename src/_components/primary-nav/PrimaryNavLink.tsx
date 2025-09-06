import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { AppRouteDefinition } from "../../_models/AppRouteDefinition";

import Icon from "../icon/Icon";

interface Props {
    route: AppRouteDefinition;
    showTitle: boolean;
}

const PrimaryNavLink: Component<Props> = props => {
    const nameClass = () => ({
        "ml-2": true,
        "text-lg": true,
        "font-bold": true,
        "align-middle": true,
        hidden: true,
        "md:inline": props.showTitle
    });

    return (
        <A
            href={props.route.path}
            activeClass="text-primary-content bg-primary"
            class="flex primary-nav-link"
            title={props.route.tooltip ?? props.route.name}
        >
            <Icon classes={props.route.icon!} />
            <span classList={nameClass()}>{props.route.name}</span>
        </A>
    );
};

export default PrimaryNavLink;
