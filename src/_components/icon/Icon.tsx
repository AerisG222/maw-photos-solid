import { Component } from "solid-js";

type Props = {
    classes: string;
};

const Icon: Component<Props> = props => {
    return <span class={`align-middle ${props.classes}`}></span>;
};

export default Icon;
