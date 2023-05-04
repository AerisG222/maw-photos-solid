import { Component } from 'solid-js';

import MoveNextButton from './components/toolbar/MoveNextButton';
import MovePreviousButton from './components/toolbar/MovePreviousButton';

const FullscreenToolbar: Component = () => {
    return (
        <>
            <MovePreviousButton />
            <MoveNextButton />
        </>
    );
};

export default FullscreenToolbar;
