import { Component } from "solid-js";

interface Props {
    title: string;
    value: string;
}

const StatBox: Component<Props> = props => {
    return (
        <div class="stat flex-1 basis-40 md:basis-56 min-w-0 place-items-center bg-secondary-content:12">
            <div class="stat-title text-secondary">{props.title}</div>
            <div class="stat-value text-secondary text-2xl md:text-4xl">{props.value}</div>
        </div>
    );
};

export default StatBox;
