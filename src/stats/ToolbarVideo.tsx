import { Component } from "solid-js";
import { useSearchParams } from "@solidjs/router";

import ToolbarButton from "../components/toolbar/ToolbarButton";

const VideoToolbar: Component = () => {
    const [search, setSearchParams] = useSearchParams();

    const selectMode = (mode: string) => {
        setSearchParams({mode});
    };

    return (
        <>
            <ToolbarButton
                active={search?.mode === "count"}
                icon="i-mdi-file-multiple"
                name="File Count"
                clickHandler={() => selectMode("count")}
            />
            <ToolbarButton
                active={search?.mode === "size"}
                icon="i-mdi-weight"
                name="File Size"
                clickHandler={() => selectMode("size")}
            />
            <ToolbarButton
                active={search?.mode === "duration"}
                icon="i-ic-round-timer"
                name="Duration"
                clickHandler={() => selectMode("duration")}
            />
        </>
    );
};

export default VideoToolbar;
