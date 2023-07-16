import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

export type VisualEffectsState = {
    // filters
    readonly grayscale: number;
    readonly sepia: number;
    readonly brightness: number;
    readonly saturation: number;
    readonly contrast: number;
    readonly invert: number;
    readonly blur: number;
    readonly hueRotate: number;

    // transforms
    readonly rotation: number;
    readonly flipHorizontal: boolean;
    readonly flipVertical: boolean;
};

export const defaultVisualEffects: VisualEffectsState = {
    // filters
    grayscale: 0,
    sepia: 0,
    brightness: 100,
    saturation: 100,
    contrast: 100,
    invert: 0,
    blur: 0,
    hueRotate: 0,

    // transforms
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false
};

export type VisualEffectsContextValue = [
    state: VisualEffectsState,
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
        getFilterStyles: () => string;

        rotateClockwise: () => void;
        rotateCounterClockwise: () => void;
        flipHorizontal: () => void;
        flipVertical: () => void;
        getTransformStyles: () => string;
    }
];

const VisualEffectsContext = createContext<VisualEffectsContextValue>([
    {...defaultVisualEffects},
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
        getFilterStyles: () => undefined,

        rotateClockwise: () => undefined,
        rotateCounterClockwise: () => undefined,
        flipHorizontal: () => undefined,
        flipVertical: () => undefined,
        getTransformStyles: () => undefined,
    }
]);

export const VisualEffectsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore({...defaultVisualEffects});

    const reset = () => setState({...defaultVisualEffects});

    const setGrayscale = (value: number) => setState({grayscale: value});
    const setBrightness = (value: number) => setState({brightness: value});
    const setContrast = (value: number) => setState({contrast: value});
    const setBlur = (value: number) => setState({blur: value});
    const setSepia = (value: number) => setState({sepia: value});
    const setSaturation = (value: number) => setState({saturation: value});
    const setInvert = (value: number) => setState({invert: value});
    const setHueRotate = (value: number) => setState({hueRotate: value});

    const getFilterStyles = () => {
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
            return `filter: ${style.join(' ')};`;
        }

        return '';
    };

    const rotateClockwise = () => setState(s => ({...s, rotation: s.rotation + 90}));
    const rotateCounterClockwise = () => setState(s => ({...s, rotation: s.rotation - 90}));
    const flipHorizontal = () => setState(s => ({...s, flipHorizontal: !s.flipHorizontal}));
    const flipVertical = () => setState(s => ({...s, flipVertical: !s.flipVertical}));

    const getTransformStyles = () => {
        const style: string[] = [];

        if(state.rotation !== 0) {
            style.push(`rotate(${state.rotation}deg)`)
        }

        if(state.flipHorizontal) {
            style.push('scaleX(-1)')
        }

        if(state.flipVertical) {
            style.push('scaleY(-1)')
        }

        if(style.length > 0) {
            return `transform: ${style.join(' ')};`;
        }

        return '';
    };

    return (
        <VisualEffectsContext.Provider value={[state, {
            reset,
            setGrayscale,
            setBrightness,
            setContrast,
            setBlur,
            setSepia,
            setSaturation,
            setInvert,
            setHueRotate,
            getFilterStyles,
            rotateClockwise,
            rotateCounterClockwise,
            flipHorizontal,
            flipVertical,
            getTransformStyles
        }]}>
            {props.children}
        </VisualEffectsContext.Provider>
    );
};

export const useVisualEffectsContext = () => useContext(VisualEffectsContext);
