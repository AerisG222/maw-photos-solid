import { Component } from 'solid-js';

type Props = {
    title: string;
    value: string;
};

const StatBox: Component<Props> = (props) => {
    return (
        <>
            <div class="stat place-items-center bg-secondary-content:12">
                <div class="stat-title">{props.title}</div>
                <div class="stat-value text-primary">{props.value}</div>
            </div>
        </>
    );
};

export default StatBox;
