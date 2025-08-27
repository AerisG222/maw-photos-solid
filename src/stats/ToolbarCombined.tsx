import { Component } from "solid-js";
import { useSearchParams } from "@solidjs/router";

import ToolbarButton from "../_components/toolbar/ToolbarButton";

const CombinedToolbar: Component = () => {
    const [search, setSearchParams] = useSearchParams();

    const selectMode = (mode: string) => {
        setSearchParams({ mode });
    };

    return (
        <>
            <ToolbarButton
                active={search?.mode === "count"}
                icon="icon-[mdi--file-multiple]"
                name="File Count"
                tooltip="File Count"
                clickHandler={() => selectMode("count")}
            />
            <ToolbarButton
                active={search?.mode === "size"}
                icon="icon-[mdi--weight]"
                name="File Size"
                tooltip="FileSize"
                clickHandler={() => selectMode("size")}
            />
        </>
    );
};

export default CombinedToolbar;
