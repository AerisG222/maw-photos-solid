import { Component } from "solid-js";
import { useMediaBreakpointContext } from "../../_contexts/MediaBreakpointContext";

const ToolbarDivider: Component = () => {
    const [, { ltMd, gteMd }] = useMediaBreakpointContext();

    const getClasses = () => ({
        divider: true,
        "my-1": true,
        "divider-horizontal": ltMd(),
        "mx-0": ltMd(),
        "mx-1": gteMd()
    });

    return <div classList={getClasses()} />;
};

export default ToolbarDivider;
