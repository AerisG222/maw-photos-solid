import { Component } from "solid-js";
import { A } from "@solidjs/router";

import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { buildPath } from "../../_models/utils/RouteUtils";

import ShortcutWrapper from './ShortcutWrapper';

type Props = {
    route: AppRouteDefinition;
    routeParams?: any;
    routeSearch?: any;
    clickHandler?: () => void;
};

const ToolbarLink: Component<Props> = (props) => {
    let el: HTMLAnchorElement;

    const handleClick = () => {
        if(props.clickHandler) {
            props.clickHandler();
        }
    };

    return (
        <ShortcutWrapper
            name={props.route.tooltip}
            shortcutKeys={props.route.shortcutKeys}
            disabled={!props.route.shortcutKeys}
            clickHandler={() => el.click()}
        >
            <A
                href={buildPath(props.route, props.routeParams, props.routeSearch)}
                onClick={evt => handleClick()}
                end={false}
                activeClass="color-primary-content bg-primary m-r[-1px]"
                inactiveClass="color-primary"
                class="px-3 py-1 hover:color-primary-content hover:bg-primary-focus hover:m-r[-1px]"
                title={props.route.tooltip}
                ref={el}
            >
                <span class={`text-6 ${props.route.icon}`} />
            </A>
        </ShortcutWrapper>
    );
};

export default ToolbarLink;
