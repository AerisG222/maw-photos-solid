import { Component } from "solid-js";

import { useVisualEffectsContext } from "../contexts/VisualEffectsContext";

import Icon from "../../_components/icon/Icon";

/*
   Turning the photograph over: two rotations and two flips.

   These were four toolbar buttons, which put them a long way from the sliders
   they share a state object - and a reset - with. Pressing Reset in the Effects
   card already straightened a photograph rotated from the toolbar; it just did
   not show that it was going to.

   The keys are not here. They stay registered by the toolbar, because a
   shortcut that only works while the panel holding its button happens to be
   open is not a shortcut - see AdjustShortcuts.
*/
const AdjustControls: Component = () => {
    const [effects, { rotateClockwise, rotateCounterClockwise, flipHorizontal, flipVertical }] =
        useVisualEffectsContext();

    const button = (icon: string, label: string, active: boolean, onClick: () => void) => (
        <button
            class="btn btn-sm flex-1"
            classList={{ "btn-primary": active }}
            onClick={onClick}
            aria-label={label}
            aria-pressed={active}
            title={label}
        >
            <Icon classes={icon} />
        </button>
    );

    return (
        <div class="mb-4">
            <div class="mb-1">Adjust</div>

            <div class="flex gap-1">
                {button("icon-[ic--round-rotate-left]", "Rotate counter-clockwise", false, () =>
                    rotateCounterClockwise()
                )}
                {button("icon-[ic--round-rotate-right]", "Rotate clockwise", false, () =>
                    rotateClockwise()
                )}
                {button("icon-[ic--round-flip]", "Flip horizontal", effects.flipHorizontal, () =>
                    flipHorizontal()
                )}
                {button(
                    "icon-[ic--round-flip] rotate-90",
                    "Flip vertical",
                    effects.flipVertical,
                    () => flipVertical()
                )}
            </div>
        </div>
    );
};

export default AdjustControls;
