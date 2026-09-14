import { createSignal, onCleanup, onMount } from "solid-js";

const IDLE_MS = 2500;

/*
   Whether the reader has gone still.

   Fullscreen is the one view whose whole point is the photograph, and it was
   the one view that kept a permanent frame of chrome around it. So the chrome
   steps back when nothing is happening and returns on the first sign that
   somebody is there.

   Two things keep it up regardless of the clock. A pointer resting *on* the
   chrome means it is being read, and something focused inside it means it is
   being used from the keyboard - fading either out from under its reader would
   be worse than never hiding it.
*/
export const createIdleChrome = (enabled: () => boolean) => {
    const [idle, setIdle] = createSignal(false);
    const [held, setHeld] = createSignal(false);

    let timer: ReturnType<typeof setTimeout> | undefined;

    const wake = () => {
        setIdle(false);

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => setIdle(true), IDLE_MS);
    };

    onMount(() => {
        const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"];

        events.forEach(name => window.addEventListener(name, wake, { passive: true }));
        wake();

        onCleanup(() => {
            events.forEach(name => window.removeEventListener(name, wake));

            if (timer) {
                clearTimeout(timer);
            }
        });
    });

    return {
        hidden: () => enabled() && idle() && !held(),
        // the chrome calls these on itself, so resting a pointer on it holds it
        hold: () => setHeld(true),
        release: () => setHeld(false)
    };
};
