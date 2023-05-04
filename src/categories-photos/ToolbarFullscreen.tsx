import { Component } from 'solid-js';

import Divider from '../components/layout/Divider';
import MoveNextButton from './components/toolbar/MoveNextButton';
import MovePreviousButton from './components/toolbar/MovePreviousButton';
import ToggleSlideshowButton from './components/toolbar/ToggleSlideshowButton';
import RotateCounterClockwiseButton from './components/toolbar/RotateCounterClockwiseButton';
import RotateClockwiseButton from './components/toolbar/RotateClockwiseButton';
import FlipHorizontalButton from './components/toolbar/FlipHorizontalButton';
import FlipVerticalButton from './components/toolbar/FlipVerticalButton';

const FullscreenToolbar: Component = () => {
    return (
        <>
            <ToggleSlideshowButton />
            <MovePreviousButton />
            <MoveNextButton />

            <Divider />

            <RotateCounterClockwiseButton />
            <RotateClockwiseButton />
            <FlipHorizontalButton />
            <FlipVerticalButton />
        </>
    );
};

export default FullscreenToolbar;
