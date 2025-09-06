import { Component } from "solid-js";

interface Props {
    title: string;
    value: string;
}

const StatBox: Component<Props> = props => {
    return (
        <div class="stat place-items-center bg-secondary-content:12">
            <div class="stat-title text-secondary">{props.title}</div>
            <div class="stat-value text-secondary">{props.value}</div>
        </div>
    );
};

export default StatBox;
