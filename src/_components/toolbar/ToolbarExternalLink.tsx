import { Component, mergeProps } from "solid-js";

type Props = {
    title: string;
    iconClass: string;
    url: string;
    textClassList?: {};
};

const ToolbarExternalLink: Component<Props> = props => {
    props = mergeProps({ textClassList: { "text-6": true } }, props);

    return (
        <a
            title={props.title}
            href={props.url}
            class="flex flex-col py-auto px-3 h-[34.14px] cursor-pointer hover:bg-secondary hover:text-secondary-content disabled:bg-transparent! disabled:color-base-content/20"
            classList={props.textClassList}
            target="blank"
        >
            <span class={`m-auto ${props.iconClass}`} />
        </a>
    );
};

export default ToolbarExternalLink;
