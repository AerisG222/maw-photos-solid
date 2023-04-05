import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { AppRouteDefinition } from '../../models/AppRouteDefinition';

interface Props {
    route: AppRouteDefinition;
}

const ToolbarLink: Component<Props> = (props) => {
    return (
        <A
            href={props.route.path}
            end={true}
            activeClass="color-primary-content bg-primary"
            inactiveClass="color-primary"
            class="px-3 py-1 hover:color-primary-content hover:bg-primary"
            title={props.route.name}
        >
            <span class={`text-6 ${props.route.icon}`} />
        </A>
    );
};

export default ToolbarLink;
