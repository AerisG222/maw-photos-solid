import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    requestMore: () => void;
}

const RequestMoreButton: Component<Props> = props => {
    return (
        <ToolbarButton
            icon="icon-[ic--round-fast-forward]"
            name="Request More"
            tooltip="Request More Media"
            shortcutKeys={["r"]}
            clickHandler={() => props.requestMore()}
        />
    );
};

export default RequestMoreButton;
