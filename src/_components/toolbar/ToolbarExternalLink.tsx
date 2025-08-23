import { Component, mergeProps } from "solid-js";

import Icon from "../icon/Icon";

import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

type Props = {
    name: string;
    tooltip: string;
    iconClass: string;
    url: string;
    textClassList?: {};
};

const ToolbarExternalLink: Component<Props> = props => {
    const [state] = useAppSettingsContext();
    props = mergeProps({ textClassList: { "text-6": true } }, props);

    const nameClass = () => ({
        "ml-2": true,
        "text-sm": true,
        "font-bold": true,
        "align-middle": true,
        hidden: true,
        "md:inline": state.isToolbarCollapsed
    });

    return (
        <a
            title={props.tooltip}
            href={props.url}
            class="flex py-2 px-3 cursor-pointer hover:bg-secondary hover:text-secondary-content disabled:bg-transparent! disabled:color-base-content/20"
            classList={props.textClassList}
            target="blank"
        >
            <Icon classes={props.iconClass} />
            <span classList={nameClass()}>{props.name}</span>
        </a>
    );
};

export default ToolbarExternalLink;
