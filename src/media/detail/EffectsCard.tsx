import { Component } from "solid-js";

import { defaultVisualEffects } from "../contexts/VisualEffectsContext";
import { useVisualEffectsContext } from "../contexts/VisualEffectsContext";

import EffectsResetButton from "./EffectsResetButton";

const EffectsCard: Component = () => {
    const [visualEffectsState, {
        reset,
        setGrayscale,
        setBrightness,
        setContrast,
        setBlur,
        setSepia,
        setSaturation,
        setInvert,
        setHueRotate
    }] = useVisualEffectsContext();

    return (
        <>
            <div class="flex gap-2">
                <div class="w-[100%]">
                    <div>
                        Grayscale ({visualEffectsState.grayscale})
                        <EffectsResetButton enabled={defaultVisualEffects.grayscale !== visualEffectsState.grayscale} handleClick={() => setGrayscale(defaultVisualEffects.grayscale)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="100" step="1" value={visualEffectsState.grayscale} onInput={evt => setGrayscale(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Brightness ({visualEffectsState.brightness}%)
                        <EffectsResetButton enabled={defaultVisualEffects.brightness !== visualEffectsState.brightness} handleClick={() => setBrightness(defaultVisualEffects.brightness)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="1000" step="1" value={visualEffectsState.brightness} onInput={evt => setBrightness(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Contrast ({visualEffectsState.contrast}%)
                        <EffectsResetButton enabled={defaultVisualEffects.contrast !== visualEffectsState.contrast} handleClick={() => setContrast(defaultVisualEffects.contrast)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="1000" step="1" value={visualEffectsState.contrast} onInput={evt => setContrast(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Blur ({visualEffectsState.blur}px)
                        <EffectsResetButton enabled={defaultVisualEffects.blur !== visualEffectsState.blur} handleClick={() => setBlur(defaultVisualEffects.blur)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="10" step="0.1" value={visualEffectsState.blur} onInput={evt => setBlur(evt.currentTarget.valueAsNumber)} /></div>
                </div>

                <div />

                <div class="w-[100%]">
                    <div>
                        Sepia ({visualEffectsState.sepia})
                        <EffectsResetButton enabled={defaultVisualEffects.sepia !== visualEffectsState.sepia} handleClick={() => setSepia(defaultVisualEffects.sepia)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="100" step="1" value={visualEffectsState.sepia} onInput={evt => setSepia(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Saturation ({visualEffectsState.saturation}%)
                        <EffectsResetButton enabled={defaultVisualEffects.saturation !== visualEffectsState.saturation} handleClick={() => setSaturation(defaultVisualEffects.saturation)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="1000" step="1" value={visualEffectsState.saturation} onInput={evt => setSaturation(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Invert ({visualEffectsState.invert}%)
                        <EffectsResetButton enabled={defaultVisualEffects.invert !== visualEffectsState.invert} handleClick={() => setInvert(defaultVisualEffects.invert)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="100" step="1" value={visualEffectsState.invert} onInput={evt => setInvert(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Hue-Rotate ({visualEffectsState.hueRotate}&deg;)
                        <EffectsResetButton enabled={defaultVisualEffects.hueRotate !== visualEffectsState.hueRotate} handleClick={() => setHueRotate(defaultVisualEffects.hueRotate)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="360" step="1" value={visualEffectsState.hueRotate} onInput={evt => setHueRotate(evt.currentTarget.valueAsNumber)} /></div>
                </div>
            </div>

            <button id="effect-reset" class="mt-4 btn btn-sm btn-error btn-outline" onClick={reset}>Reset</button>
        </>
    );
};

export default EffectsCard;
