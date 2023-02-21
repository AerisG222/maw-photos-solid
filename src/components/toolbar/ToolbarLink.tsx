import { Component } from "solid-js";
import { A } from "@solidjs/router";

interface Props {
    icon: string;
    name: string;
    url: string;
}

const ToolbarLink: Component<Props> = (props) => {
    return (
        <A
            href={props.url}
            end={true}
            activeClass="text-red-9"
            inactiveClass="text-blue-700"
            class="px-3 py-1 hover:text-red-7 hover:bg-red-1"
            title={props.name}
        >
            <span class={`text-7 ${props.icon}`} />
        </A>
    );
};

export default ToolbarLink;
