import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { getNameWithShortcut } from "../shortcuts/_util";
import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

import ShortcutWrapper from "../shortcuts/ShortcutWrapper";
import Icon from "../icon/Icon";

// one definition, so the forced and the routed highlight cannot drift apart
const ACTIVE_CLASS = "text-primary-content bg-primary mr[-1px]";
const INACTIVE_CLASS = "text-primary";

interface Props {
    href: string;
    route: AppRouteDefinition;
    /*
       Overrides the router's own match. For a link whose href is a *destination*
       rather than the path you are on: the media listing points at whichever view
       was last used, so a caller standing on a different one still knows the
       listing is the current one, and the router does not.

       Left undefined, the highlight follows the url, which is what a view link
       wants - it stays lit while a photo below it is open.
    */
    active?: boolean;
    /*
       Rendered as a dead entry rather than dropped, so a toolbar keeps its shape
       as the thing it acts on comes and goes - the places screen offers both
       listings at the root, where there is no one place to list.
    */
    disabled?: boolean;
    clickHandler?: () => void;
}

const ToolbarLink: Component<Props> = props => {
    const [state] = useAppSettingsContext();
    let el!: HTMLAnchorElement;

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

    const label = () => props.route.tooltip ?? props.route.name;

    const body = () => (
        <>
            <Icon classes={props.route.icon!} />
            <span classList={nameClass()}>{props.route.name}</span>
        </>
    );

    return (
        <ShortcutWrapper
            name={label()}
            shortcutKeys={props.route.shortcutKeys}
            disabled={!props.route.shortcutKeys || !!props.disabled}
            clickHandler={() => el.click()}
        >
            <Show
                when={!props.disabled}
                fallback={
                    <span
                        class="flex px-3 py-2 text-base-content opacity-40 cursor-not-allowed"
                        title={label()}
                        aria-disabled={true}
                    >
                        {body()}
                    </span>
                }
            >
                <A
                    href={props.href}
                    onClick={() => handleClick()}
                    end={false}
                    activeClass={props.active === undefined ? ACTIVE_CLASS : ""}
                    inactiveClass={props.active === undefined ? INACTIVE_CLASS : ""}
                    classList={
                        props.active === undefined
                            ? {}
                            : { [ACTIVE_CLASS]: props.active, [INACTIVE_CLASS]: !props.active }
                    }
                    class="flex px-3 py-2 hover:text-primary-content hover:bg-primary/80"
                    title={getNameWithShortcut(label(), props.route.shortcutKeys)}
                    ref={el}
                >
                    {body()}
                </A>
            </Show>
        </ShortcutWrapper>
    );
};

export default ToolbarLink;
