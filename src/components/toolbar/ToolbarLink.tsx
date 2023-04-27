import { Component } from "solid-js";
import { A } from "@solidjs/router";

import { AppRouteDefinition } from '../../models/AppRouteDefinition';
import { buildPath } from '../../models/utils/RouteUtils';

interface Props {
    route: AppRouteDefinition;
    routeParams?: any;
    routeSearch?: any;
    clickHandler?: () => void;
}

const ToolbarLink: Component<Props> = (props) => {
    const handleClick = () => {
        if(props.clickHandler) {
            props.clickHandler();
        }
    }

    return (
        <A
            href={buildPath(props.route, props.routeParams, props.routeSearch)}
            onClick={evt => handleClick()}
            end={false}
            activeClass="color-primary-content bg-primary m-r[-1px]"
            inactiveClass="color-primary"
            class="px-3 py-1 hover:color-primary-content hover:bg-primary hover:m-r[-1px]"
            title={props.route.name}
        >
            <span class={`text-6 ${props.route.icon}`} />
        </A>
    );
};

export default ToolbarLink;
