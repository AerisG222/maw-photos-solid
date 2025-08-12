import { Component } from "solid-js";
import { A } from "@solidjs/router";

import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { buildPath } from "../../_models/utils/RouteUtils";

import ShortcutWrapper from './ShortcutWrapper';
import { getNameWithShortcut } from './_util';

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
                activeClass="text-primary-content bg-primary mr[-1px]"
                inactiveClass="text-primary"
                class="px-3 py-1 hover:text-primary-content hover:bg-primary hover:mr[-1px]"
                title={getNameWithShortcut(props.route.tooltip, props.route.shortcutKeys)}
                ref={el}
            >
                <span class={`text-6 ${props.route.icon}`} />
            </A>
        </ShortcutWrapper>
    );
};

export default ToolbarLink;
