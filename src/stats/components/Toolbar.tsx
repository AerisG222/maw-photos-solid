import { Component, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";

import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    initialParams: {
        type: "all" | "photo" | "video";
        mode: "category-count" | "count" | "size" | "duration";
    };
    showSummarizeByCategoryCount: boolean;
}

const Toolbar: Component<Props> = props => {
    const [search, setSearchParams] = useSearchParams();

    setSearchParams(props.initialParams);

    const selectMode = (mode: string) => {
        setSearchParams({ mode });
    };

    const selectType = (type: string) => {
        setSearchParams({ type });
    };

    return (
        <ToolbarLayout>
            <ToolbarButton
                active={search?.type === "all"}
                icon="icon-[ic--round-functions]"
                name="All"
                tooltip="Include all Media"
                clickHandler={() => selectType("all")}
            />
            <ToolbarButton
                active={search?.type === "photo"}
                icon="icon-[ic--outline-photo-camera]"
                name="Photos"
                tooltip="Include only Photos"
                clickHandler={() => selectType("photo")}
            />
            <ToolbarButton
                active={search?.type === "video"}
                icon="icon-[ic--round-videocam]"
                name="Videos"
                tooltip="Include only Videos"
                clickHandler={() => selectType("video")}
            />

            <ToolbarDivider />

            <Show when={props.showSummarizeByCategoryCount}>
                <ToolbarButton
                    active={search?.mode === "category-count"}
                    icon="icon-[mdi--folder]"
                    name="Categories"
                    tooltip="Summarize by Category Count"
                    clickHandler={() => selectMode("category-count")}
                />
            </Show>
            <ToolbarButton
                active={search?.mode === "count"}
                icon="icon-[mdi--file-multiple]"
                name="Media"
                tooltip="Summarize by Media Count"
                clickHandler={() => selectMode("count")}
            />
            <ToolbarButton
                active={search?.mode === "size"}
                icon="icon-[mdi--weight]"
                name="Storage"
                tooltip="Summarize by Storage"
                clickHandler={() => selectMode("size")}
            />
            <ToolbarButton
                active={search?.mode === "duration"}
                icon="icon-[ic--round-timer]"
                name="Duration"
                tooltip="Summarize by Duration"
                clickHandler={() => selectMode("duration")}
            />
        </ToolbarLayout>
    );
};

export default Toolbar;
