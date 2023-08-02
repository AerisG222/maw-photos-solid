import { Component } from "solid-js";

import MoveNextButton from "./toolbar/MoveNextButton";
import MovePreviousButton from "./toolbar/MovePreviousButton";

const MapToolbar: Component = () => {
    return (
        <>
            <MovePreviousButton />
            <MoveNextButton />
        </>
    );
};

export default MapToolbar;
