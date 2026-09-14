import { Component } from "solid-js";
import { A, useLocation } from "@solidjs/router";
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

    /*
       The same match the router highlights on, said out loud. `A` sets the
       class and nothing else, so without this the current area is announced
       exactly like the other five.
    */
    const location = useLocation();
    const isCurrent = () => location.pathname.startsWith(props.route.path!);

    return (
        <A
            href={props.route.path!}
            activeClass="text-primary-content bg-primary"
            class="flex primary-nav-link"
            aria-label={props.route.tooltip ?? props.route.name}
            aria-current={isCurrent() ? "page" : undefined}
            title={props.route.tooltip ?? props.route.name}
        >
            <Icon classes={props.route.icon!} />
            <span classList={nameClass()}>{props.route.name}</span>
        </A>
    );
};

export default PrimaryNavLink;
