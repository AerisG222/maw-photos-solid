import { Component, splitProps } from "solid-js";
import { LinkOptions, useLinkProps } from "@tanstack/solid-router";

import { RouteDisplay } from "../../_models/RouteDisplay";

import Icon from "../icon/Icon";
import Tooltip from "../tooltip/Tooltip";

interface Props {
    route: RouteDisplay;
    // the area's entry point - built with `linkOptions`, so it is checked
    link: LinkOptions;
    showTitle: boolean;
}

const PrimaryNavLink: Component<Props> = props => {
    const nameClass = () => ({
        "ml-2": true,
        "text-lg": true,
        "font-bold": true,
        "align-middle": true,
        hidden: true,
        "md:inline": props.showTitle
    });

    /*
       Lit anywhere inside the area, query string aside, and announced as the
       current page there too - the router sets `aria-current` along with the
       class, so the current area is not read out exactly like the other five.
    */
    const linkProps = useLinkProps({
        get to() {
            return props.link.to;
        },
        get href() {
            return props.link.href;
        },
        class: "flex primary-nav-link",
        activeProps: { class: "text-primary-content bg-primary" },
        activeOptions: { includeSearch: false }
    } as LinkOptions);

    // an anchor's `type` is a hint nobody sets here, and the tooltip types it as a button's
    const [, anchorProps] = splitProps(linkProps, ["type"]);

    return (
        <Tooltip<"a">
            as="a"
            {...anchorProps}
            content={props.route.tooltip ?? props.route.name}
            aria-label={props.route.tooltip ?? props.route.name}
        >
            <Icon classes={props.route.icon!} />
            <span classList={nameClass()}>{props.route.name}</span>
        </Tooltip>
    );
};

export default PrimaryNavLink;
