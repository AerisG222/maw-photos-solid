import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    // shown even with nothing left to fetch, so the group it heads does not
    // change width as a feed reaches its end
    disabled: boolean;
    requestMore: () => void;
}

const RequestMoreButton: Component<Props> = props => {
    return (
        <ToolbarButton
            disabled={props.disabled}
            icon="icon-[ic--round-fast-forward]"
            name="Request More"
            tooltip="Request More Media"
            shortcutKeys={["r"]}
            clickHandler={() => props.requestMore()}
        />
    );
};

export default RequestMoreButton;
