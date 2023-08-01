import { Component } from "solid-js";
import { useSearchParams } from "@solidjs/router";

import ToolbarButton from "../components/toolbar/ToolbarButton";

const CombinedToolbar: Component = () => {
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
        </>
    );
};

export default CombinedToolbar;
