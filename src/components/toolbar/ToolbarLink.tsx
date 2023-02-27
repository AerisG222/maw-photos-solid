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
            activeClass="text-red-9"
            inactiveClass="text-blue-700"
            class="px-3 py-1 hover:text-red-7 hover:bg-red-1"
            title={props.route.name}
        >
            <span class={`text-7 ${props.route.icon}`} />
        </A>
    );
};

export default ToolbarLink;
