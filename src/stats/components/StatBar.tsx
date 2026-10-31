import { Component } from "solid-js";

import { StatBarData } from "../models/StatbarData";
import { formatCount, formatStorage, formatDuration } from "../_funcs";

import StatBox from "./StatBox";

interface Props {
    statbarData: StatBarData;
    mediaCountTitle: string;
}

/*
   Not daisyUI's `stats` row, which never wraps: five boxes held it at 629px at any
   size, and everything around it was stretched to match. These fill each line and
   wrap by the room they actually have, which depends on the rails as well as the
   window.
*/
const StatBar: Component<Props> = props => {
    return (
        <>
            <div class="flex flex-wrap shadow w-full rounded-box">
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
