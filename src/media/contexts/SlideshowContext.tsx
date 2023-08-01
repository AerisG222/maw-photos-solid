import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { useMediaListContext } from "./MediaListContext";
import { useMediaPageSettingsContext } from '../../contexts/settings/MediaPageSettingsContext';

export type SlideshowState = {
    isPlaying: boolean;
};

const defaultSlideshowState = {
    isPlaying: false
};

export type SlideshowContextValue = [
    state: SlideshowState,
    actions: {
        start: () => void;
        stop: () => void;
        toggle: () => void;
    }
];

const SlideshowContext = createContext<SlideshowContextValue>();

export const SlideshowProvider: ParentComponent = (props) => {
    const [state, setState] = createStore({...defaultSlideshowState});
    const [mediaList, {activeItemIsLast, moveFirst, moveNext}] = useMediaListContext();
    const [mediaPageSettings] = useMediaPageSettingsContext();

    let intervalId: number;

    const start = () => {
        setState({isPlaying: true});

        if(!mediaList.activeItem) {
            moveFirst();
        }

        if(intervalId) {
            clearInterval(intervalId);
        }

        intervalId = setInterval(() => {
            if(activeItemIsLast()) {
                stop();
                return;
            }

            moveNext();
        }, mediaPageSettings.slideshowDisplayDurationSeconds * 1000);
    };

    const stop = () => {
        setState({isPlaying: false});

        if(intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
        }
    };

    const toggle = () => {
        if(state.isPlaying) {
            stop();
        } else {
            start();
        }
    };

    return (
        <SlideshowContext.Provider value={[state, {
            start,
            stop,
            toggle
        }]}>
            {props.children}
        </SlideshowContext.Provider>
    );
};

export const useSlideshowContext = () => useContext(SlideshowContext);
