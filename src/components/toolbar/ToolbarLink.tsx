import { Component, createUniqueId, onCleanup, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { createShortcut } from '@solid-primitives/keyboard';

import { AppRouteDefinition } from '../../_models/AppRouteDefinition';
import { buildPath } from '../../_models/utils/RouteUtils';
import { useShortcutContext } from '../../contexts/ShortcutContext';

type Props = {
    route: AppRouteDefinition;
    routeParams?: any;
    routeSearch?: any;
    clickHandler?: () => void;
};

const ToolbarLink: Component<Props> = (props) => {
    let id = undefined;
    let el: HTMLAnchorElement;
    const [, { addShortcut, removeShortcut }] = useShortcutContext();

    const handleClick = () => {
        if(props.clickHandler) {
            props.clickHandler();
        }
    };

    onMount(() => {
        if(props.route.shortcutKeys) {
            id = createUniqueId();

            createShortcut(props.route.shortcutKeys, () => { el.click() });

            addShortcut({
                id,
                shortcut: props.route.shortcutKeys,
                description: props.route.name
            });
        }
    });

    onCleanup(() => {
        removeShortcut(id);
    })

    return (
        <A
            href={buildPath(props.route, props.routeParams, props.routeSearch)}
            onClick={evt => handleClick()}
            end={false}
            activeClass="color-primary-content bg-primary m-r[-1px]"
            inactiveClass="color-primary"
            class="px-3 py-1 hover:color-primary-content hover:bg-primary hover:m-r[-1px]"
            title={props.route.tooltip}
            ref={el}
        >
            <span class={`text-6 ${props.route.icon}`} />
        </A>
    );
};

export default ToolbarLink;
