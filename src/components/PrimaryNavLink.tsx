import { Component } from "solid-js";

interface Props {
    icon: string,
    name: string,
    url: string
}

const PrimaryNavLink: Component<Props> = (props) => {
    return <a href={props.url} class={`text-blue-700 ${props.icon}`}>{props.name}</a>;
};

export default PrimaryNavLink;
