import { Component } from "solid-js";

export type IconProps = {
    classes: string;
};

const Icon: Component<IconProps> = (props) => {
    return <span class={`align-middle inline-block ${props.classes}`}></span>;
};

export default Icon;
