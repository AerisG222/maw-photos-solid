import { Component } from "solid-js";
import { A } from "@solidjs/router";

import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { buildPath } from "../../_models/utils/RouteUtils";
import { getNameWithShortcut } from "../shortcuts/_util";
import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

import ShortcutWrapper from "../shortcuts/ShortcutWrapper";
import Icon from "../icon/Icon";

type Props = {
    route: AppRouteDefinition;
    routeParams?: any;
    routeSearch?: any;
    clickHandler?: () => void;
};

const ToolbarLink: Component<Props> = props => {
    const [state] = useAppSettingsContext();
    let el: HTMLAnchorElement;

    const handleClick = () => {
        if (props.clickHandler) {
            props.clickHandler();
        }
    };

    const nameClass = () => ({
        "ml-2": true,
        "text-sm": true,
        "font-bold": true,
        "align-middle": true,
        hidden: true,
        "md:inline": state.isToolbarCollapsed
    });

    return (
        <ShortcutWrapper
            name={props.route.tooltip ?? props.route.name}
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
                class="flex px-3 py-2 hover:text-primary-content hover:bg-primary/80"
                title={getNameWithShortcut(
                    props.route.tooltip ?? props.route.name,
                    props.route.shortcutKeys
                )}
                ref={el}
            >
                <Icon classes={props.route.icon!} />
                <span classList={nameClass()}>{props.route.name}</span>
            </A>
        </ShortcutWrapper>
    );
};

export default ToolbarLink;
