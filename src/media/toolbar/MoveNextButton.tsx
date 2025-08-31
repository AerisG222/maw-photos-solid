import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

type Props = {
    isLast: boolean;
    moveNext: () => void;
};

const MoveNextButton: Component<Props> = props => {
    return (
        <ToolbarButton
            disabled={props.isLast}
            icon="icon-[ic--round-chevron-right]"
            name="Next"
            tooltip="Move Next"
            shortcutKeys={["arrowright"]}
            clickHandler={props.moveNext}
        />
    );
};

export default MoveNextButton;
