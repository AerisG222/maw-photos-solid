import { Component } from "solid-js";

interface Props {
    classes: string;
}

const Icon: Component<Props> = props => {
    return <span class={`align-middle ${props.classes}`} />;
};

export default Icon;
