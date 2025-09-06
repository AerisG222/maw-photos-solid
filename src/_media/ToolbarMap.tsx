import { Component } from "solid-js";

import MoveNextButton from "./toolbar/MoveNextButton";
import MovePreviousButton from "./toolbar/MovePreviousButton";

interface Props {
    activeMediaIsFirst: boolean;
    activeMediaIsLast: boolean;
    moveNext: () => void;
    movePrevious: () => void;
}

const MapToolbar: Component<Props> = props => {
    return (
        <>
            <MovePreviousButton
                isFirst={props.activeMediaIsFirst}
                movePrevious={props.movePrevious}
            />
            <MoveNextButton isLast={props.activeMediaIsLast} moveNext={props.moveNext} />
        </>
    );
};

export default MapToolbar;
