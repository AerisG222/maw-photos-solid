import { Component } from 'solid-js';

export type Props = {
    title: string;
    value: string;
};

const StatBox: Component<Props> = (props) => {
    return (
        <>
            <div class="stat place-items-center w-[210px] h-[135px] bg-secondary-content:12">
                <div class="stat-title">{props.title}</div>
                <div class="stat-value text-primary">{props.value}</div>
            </div>
        </>
    )
}

export default StatBox;
