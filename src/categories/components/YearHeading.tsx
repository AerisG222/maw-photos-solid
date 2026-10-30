import { Component } from "solid-js";

import StickyHeader from "../../_components/layout/StickyHeader";

interface Props {
    year: number;
}

// needs a box of its own, shared with that year's categories - see StickyHeader
const YearHeading: Component<Props> = props => (
    <StickyHeader>
        <h2 class="head2 m-0">{props.year}</h2>
    </StickyHeader>
);

export default YearHeading;
