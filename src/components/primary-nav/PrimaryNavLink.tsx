import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { AppRouteDefinition } from '../../models/AppRouteDefinition';

type Props = {
    route: AppRouteDefinition;
};

const PrimaryNavLink: Component<Props> = (props) => {
    return (
        <A
            href={props.route.path}
            activeClass="color-primary-content bg-primary"
            inactiveClass="color-primary"
            class="px-4 py-2 hover:color-primary-content hover:bg-primary"
            title={props.route.name}
        >
            <span class={`text-8 ${props.route.icon}`} />
        </A>
    );
};

export default PrimaryNavLink;
