import { Component } from "solid-js";

import { StatBarData } from "../models/StatbarData";
import { formatCount, formatStorage, formatDuration } from "../_funcs";

import StatBox from "./StatBox";

type Props = {
    statbarData: StatBarData;
    mediaCountTitle: string;
};

const StatBar: Component<Props> = props => {
    return (
        <>
            <div class="stats shadow w-full">
                <StatBox title="Years" value={formatCount(props.statbarData.yearCount)} />
                <StatBox title="Categories" value={formatCount(props.statbarData.categoryCount)} />
                <StatBox
                    title={props.mediaCountTitle}
                    value={formatCount(props.statbarData.mediaCount)}
                />
                <StatBox title="Storage" value={formatStorage(props.statbarData.mediaSize)} />
                <StatBox title="Duration" value={formatDuration(props.statbarData.duration)} />
            </div>
        </>
    );
};

export default StatBar;
