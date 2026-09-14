import { Component } from "solid-js";

import { useVisualEffectsContext } from "../contexts/VisualEffectsContext";

import ShortcutWrapper from "../../_components/shortcuts/ShortcutWrapper";

/*
   The keys for rotate and flip, with no buttons attached.

   Their controls moved into the Inspector's Adjust card, which is the right
   place for them - they share a state object and a reset with the sliders
   there. But a card is something you open, and a shortcut that only works while
   the panel holding it happens to be open is not a shortcut. So the keys stay
   registered here, in the toolbar, which is mounted for as long as a photograph
   is on screen.

   `ShortcutWrapper` with no children renders nothing and registers everything,
   which is the whole of the trick.
*/
const AdjustShortcuts: Component = () => {
    const [, { rotateClockwise, rotateCounterClockwise }] = useVisualEffectsContext();

    return (
        <>
            <ShortcutWrapper
                name="Rotate Left"
                shortcutKeys={["a"]}
                clickHandler={rotateCounterClockwise}
            />
            <ShortcutWrapper
                name="Rotate Right"
                shortcutKeys={["d"]}
                clickHandler={rotateClockwise}
            />
        </>
    );
};

export default AdjustShortcuts;
