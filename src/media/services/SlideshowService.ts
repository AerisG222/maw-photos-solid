import { createSignal } from 'solid-js';
import { INavigable } from './INavigable';

const [intervalId, setIntervalId] = createSignal<number | undefined>(undefined);

export class SlideshowService {
    constructor(
        private navigable: INavigable,
        private displayDurationSeconds: number
    ) { }

    start = () => {
        if (intervalId()) {
            clearInterval(intervalId());
        }

        setIntervalId(
            setInterval(() => {
                if (this.navigable.isActiveMediaLast()) {
                    this.stop();
                    return;
                }

                this.navigable.moveNext();
            }, this.displayDurationSeconds * 1000));
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
}
