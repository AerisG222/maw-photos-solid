import { Component } from "solid-js";

type Props = {
    year: number;
};

const YearHeading: Component<Props> = props => {
    return (
        <>
            <h2 class="head3 mb-0 mt-3">{props.year}</h2>
            <div class="divider mt-[-.5rem] mb-1" />
        </>
    );
};

export default YearHeading;
