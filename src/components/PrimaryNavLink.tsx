import { Component } from "solid-js";
import { A } from "@solidjs/router";

interface Props {
    icon: string;
    name: string;
    url: string;
}

const PrimaryNavLink: Component<Props> = (props) => {
    return (
        <A
            href={props.url}
            end={true}
            activeClass="text-red-9"
            inactiveClass="text-blue-700"
            class={`text-8 ${props.icon}`}
            title={props.name}
        >
            {props.name}
        </A>
    );
};

export default PrimaryNavLink;
