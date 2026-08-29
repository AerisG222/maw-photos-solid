import { createSignal } from "solid-js";
import { INavigable } from "./INavigable";

const [intervalId, setIntervalId] = createSignal<number | undefined>(undefined);

export class SlideshowService {
    constructor(
        private navigable: INavigable,
        private displayDurationSeconds: number
    ) {}

    /* eslint-disable solid/reactivity -- start, stop and toggle are called from
       click handlers and isPlaying is read from JSX, so every read below is
       already inside a scope the rule cannot see from here */
    start = () => {
        if (intervalId()) {
            clearInterval(intervalId());
        }

        setIntervalId(
            window.setInterval(() => {
                if (this.navigable.isActiveMediaLast()) {
                    this.stop();
                    return;
                }

                this.navigable.moveNext();
            }, this.displayDurationSeconds * 1000)
        );
    };

    stop = () => {
        if (intervalId()) {
            clearInterval(intervalId());
            setIntervalId(undefined);
        }
    };

    toggle = () => {
        if (this.isPlaying()) {
            this.stop();
        } else {
            this.start();
        }
    };

    isPlaying = () => intervalId() !== undefined;
    /* eslint-enable solid/reactivity */
}
