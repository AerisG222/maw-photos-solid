import { Component, Show } from "solid-js";

import { StatMode } from "../_funcs";
import { StatsSearch, StatType } from "../_search";

import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    // what the address says now - already validated, defaults filled in, by the route
    search: StatsSearch;
    onChange: (change: Partial<StatsSearch>) => void;
    showSummarizeByCategoryCount: boolean;
}

/*
   The type and mode, as the address has them. This used to write its own
   starting values into the address as it mounted - which, on a year reached
   from the summary, threw away the type and mode the summary had passed along.
   The route's search validation supplies the defaults now, so there is nothing
   to write.
*/
const Toolbar: Component<Props> = props => {
    const search = () => props.search;

    const selectMode = (mode: StatMode) => props.onChange({ mode });

    const selectType = (type: StatType) => props.onChange({ type });

    return (
        <ToolbarLayout>
            <ToolbarButton
                active={search().type === "all"}
                icon="icon-[ic--round-functions]"
                name="All"
                tooltip="Include all Media"
                clickHandler={() => selectType("all")}
            />
            <ToolbarButton
                active={search().type === "photo"}
                icon="icon-[ic--round-photo-camera]"
                name="Photos"
                tooltip="Include only Photos"
                clickHandler={() => selectType("photo")}
            />
            <ToolbarButton
                active={search().type === "video"}
                icon="icon-[ic--round-videocam]"
                name="Videos"
                tooltip="Include only Videos"
                clickHandler={() => selectType("video")}
            />

            <ToolbarDivider />

            <Show when={props.showSummarizeByCategoryCount}>
                <ToolbarButton
                    active={search().mode === "category-count"}
                    icon="icon-[ic--round-folder]"
                    name="Categories"
                    tooltip="Summarize by Category Count"
                    clickHandler={() => selectMode("category-count")}
                />
            </Show>
            <ToolbarButton
                active={search().mode === "count"}
                icon="icon-[ic--round-file-copy]"
                name="Media"
                tooltip="Summarize by Media Count"
                clickHandler={() => selectMode("count")}
            />
            <ToolbarButton
                active={search().mode === "size"}
                icon="icon-[ic--round-storage]"
                name="Storage"
                tooltip="Summarize by Storage"
                clickHandler={() => selectMode("size")}
            />
            <ToolbarButton
                active={search().mode === "duration"}
                icon="icon-[ic--round-timer]"
                name="Duration"
                tooltip="Summarize by Duration"
                clickHandler={() => selectMode("duration")}
            />
        </ToolbarLayout>
    );
};

export default Toolbar;
