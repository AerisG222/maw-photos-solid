import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

import { usePhotoListContext } from './PhotoListContext';

export type SlideshowState = {
    intervalSeconds: number,
    isPlaying: boolean;
}

const defaultSlideshowState = {
    intervalSeconds: 2.5,
    isPlaying: false
};

export type SlideshowContextValue = [
    state: SlideshowState,
    actions: {
        setSlideshowInterval: (interval: number) => void,
        start: () => void;
        stop: () => void;
        toggle: () => void;
    }
];

const SlideshowContext = createContext<SlideshowContextValue>([
    {...defaultSlideshowState},
    {
        setSlideshowInterval: (interval: number) => undefined,
        start: () => undefined,
        stop: () => undefined,
        toggle: () => undefined
    }
]);

export const SlideshowProvider: ParentComponent = (props) => {
    let id: number;

    const [state, setState] = createStore({...defaultSlideshowState});
    const [photoList, {activePhotoIsLast, moveFirst, moveNext}] = usePhotoListContext();

    const setSlideshowInterval = (interval: number) => setState({intervalSeconds: interval});

    const start = () => {
        setState({isPlaying: true});

        if(!photoList.activePhoto) {
            moveFirst();
        }

        if(id) {
            clearInterval(id);
        }

        id = setInterval(() => {
            if(activePhotoIsLast()) {
                stop();
                return;
            }

            moveNext();
        }, state.intervalSeconds * 1000);
    };

    const stop = () => {
        setState({isPlaying: false});

        if(id) {
            clearInterval(id);
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
            setSlideshowInterval,
            start,
            stop,
            toggle
        }]}>
            {props.children}
        </SlideshowContext.Provider>
    );
}

export const useSlideshowContext = () => useContext(SlideshowContext);
