import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { AppRouteDefinition } from '../../models/AppRouteDefinition';

interface Props {
    route: AppRouteDefinition;
}

const PrimaryNavLink: Component<Props> = (props) => {
    return (
        <A
            href={props.route.path}
            //end={true}
            activeClass="text-red-9"
            inactiveClass="text-blue-700"
            class="px-4 py-2 hover:text-red-7 hover:bg-red-1"
            title={props.route.name}
        >
            <span class={`text-8 ${props.route.icon}`} />
        </A>
    );
};

export default PrimaryNavLink;
