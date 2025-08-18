import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { AppRouteDefinition } from "../../_models/AppRouteDefinition";

import Icon from "../icon/Icon";

type Props = {
    route: AppRouteDefinition;
};

const PrimaryNavLink: Component<Props> = props => {
    return (
        <A
            href={props.route.path}
            activeClass="text-primary-content bg-primary"
            class="flex primary-nav-link"
            title={props.route.name}
        >
            <Icon classes={props.route.icon!} />
        </A>
    );
};

export default PrimaryNavLink;
