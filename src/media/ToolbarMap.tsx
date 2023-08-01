import { Component } from "solid-js";

import MoveNextButton from "./toolbar/MoveNextButton";
import MovePreviousButton from "./toolbar/MovePreviousButton";

const FullscreenToolbar: Component = () => {
    return (
        <>
            <MovePreviousButton />
            <MoveNextButton />
        </>
    );
};

export default FullscreenToolbar;
