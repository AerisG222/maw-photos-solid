import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { defaultPhotoEffects, PhotoEffectsState } from '../models/PhotoEffects';

export type PhotoEffectsContextValue = [
    state: PhotoEffectsState,
    actions: {
        reset: () => void;

        setGrayscale: (value: number) => void;
        setBrightness: (value: number) => void;
        setContrast: (value: number) => void;
        setBlur: (value: number) => void;
        setSepia: (value: number) => void;
        setSaturation: (value: number) => void;
        setInvert: (value: number) => void;
        setHueRotate: (value: number) => void;
        getEffectStyles: () => void;
    }
];

const PhotoEffectsContext = createContext<PhotoEffectsContextValue>([
    {...defaultPhotoEffects},
    {
        reset: () => undefined,

        setGrayscale: (value: number) => undefined,
        setBrightness: (value: number) => undefined,
        setContrast: (value: number) => undefined,
        setBlur: (value: number) => undefined,
        setSepia: (value: number) => undefined,
        setSaturation: (value: number) => undefined,
        setInvert: (value: number) => undefined,
        setHueRotate: (value: number) => undefined,
        getEffectStyles: () => undefined,
    }
]);

export const PhotoEffectsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore({...defaultPhotoEffects});

    const reset = () => setState({...defaultPhotoEffects});

    const setGrayscale = (value: number) => setState({grayscale: value});
    const setBrightness = (value: number) => setState({brightness: value});
    const setContrast = (value: number) => setState({contrast: value});
    const setBlur = (value: number) => setState({blur: value});
    const setSepia = (value: number) => setState({sepia: value});
    const setSaturation = (value: number) => setState({saturation: value});
    const setInvert = (value: number) => setState({invert: value});
    const setHueRotate = (value: number) => setState({hueRotate: value});

    const getEffectStyles = () => {
        const style: string[] = [];

        if (state.grayscale > 0) {
            style.push(`grayscale(${state.grayscale}%)`);
        }

        if (state.sepia > 0) {
            style.push(`sepia(${state.sepia}%)`);
        }

        if (state.blur > 0) {
            style.push(`blur(${state.blur}px)`);
        }

        if (state.saturation !== 100) {
            style.push(`saturate(${state.saturation}%)`);
        }

        if (state.brightness !== 100) {
            style.push(`brightness(${state.brightness}%)`);
        }

        if (state.contrast !== 100) {
            style.push(`contrast(${state.contrast}%)`);
        }

        if (state.hueRotate > 0) {
            style.push(`hue-rotate(${state.hueRotate}deg)`);
        }

        if (state.invert > 0) {
            style.push(`invert(${state.invert}%)`);
        }

        if(style.length > 0) {
            return `filter: ${style.join(' ')}`;
        }

        return '';
    }

    return (
        <PhotoEffectsContext.Provider value={[state, {
            reset,
            setGrayscale,
            setBrightness,
            setContrast,
            setBlur,
            setSepia,
            setSaturation,
            setInvert,
            setHueRotate,
            getEffectStyles,
        }]}>
            {props.children}
        </PhotoEffectsContext.Provider>
    );
}

export const usePhotoEffectsContext = () => useContext(PhotoEffectsContext);