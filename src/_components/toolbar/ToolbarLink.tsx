import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

import ShortcutWrapper from "../shortcuts/ShortcutWrapper";
import Icon from "../icon/Icon";
import Tooltip from "../tooltip/Tooltip";

// one definition, so the forced and the routed highlight cannot drift apart
const ACTIVE_CLASS = "text-primary-content bg-primary mr-[-1px]";
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
        "md:inline": state.showToolbarLabels
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
                    <Tooltip
                        as="span"
                        content={label()}
                        class="flex px-3 py-2 text-base-content opacity-40 cursor-not-allowed"
                        aria-label={label()}
                        aria-disabled={true}
                    >
                        {body()}
                    </Tooltip>
                }
            >
                <Tooltip
                    as={A}
                    content={label()}
                    shortcutKeys={props.route.shortcutKeys}
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
                    /*
                       The name span is hidden below `md`, so without this the
                       link is an icon and a tooltip. `aria-current` is the
                       navigation counterpart of the highlight beside it - where
                       the caller forces `active` we state it, and where it is
                       left to the router we cannot know here, so the class does
                       the talking and `end={false}` keeps it lit.
                    */
                    aria-label={label()}
                    aria-current={props.active ? "page" : undefined}
                    ref={el}
                >
                    {body()}
                </Tooltip>
            </Show>
        </ShortcutWrapper>
    );
};

export default ToolbarLink;
