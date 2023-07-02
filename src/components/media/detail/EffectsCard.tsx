import { Component } from 'solid-js';

import { defaultPhotoEffects } from '../../../models/PhotoEffects';
import { usePhotoEffectsContext } from '../../../contexts/PhotoEffectsContext';

import EffectsResetButton from './EffectsResetButton';

const EffectsCard: Component = () => {
    const [photoEffectsState, {
        reset,
        setGrayscale,
        setBrightness,
        setContrast,
        setBlur,
        setSepia,
        setSaturation,
        setInvert,
        setHueRotate
    }] = usePhotoEffectsContext();

    return (
        <>
            <div class="flex flex-gap-2">
                <div class="w-[100%]">
                    <div>
                        Grayscale ({photoEffectsState.grayscale})
                        <EffectsResetButton enabled={defaultPhotoEffects.grayscale !== photoEffectsState.grayscale} handleClick={() => setGrayscale(defaultPhotoEffects.grayscale)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="100" step="1" value={photoEffectsState.grayscale} onInput={evt => setGrayscale(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Brightness ({photoEffectsState.brightness}%)
                        <EffectsResetButton enabled={defaultPhotoEffects.brightness !== photoEffectsState.brightness} handleClick={() => setBrightness(defaultPhotoEffects.brightness)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="1000" step="1" value={photoEffectsState.brightness} onInput={evt => setBrightness(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Contrast ({photoEffectsState.contrast}%)
                        <EffectsResetButton enabled={defaultPhotoEffects.contrast !== photoEffectsState.contrast} handleClick={() => setContrast(defaultPhotoEffects.contrast)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="1000" step="1" value={photoEffectsState.contrast} onInput={evt => setContrast(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Blur ({photoEffectsState.blur}px)
                        <EffectsResetButton enabled={defaultPhotoEffects.blur !== photoEffectsState.blur} handleClick={() => setBlur(defaultPhotoEffects.blur)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="10" step="0.1" value={photoEffectsState.blur} onInput={evt => setBlur(evt.currentTarget.valueAsNumber)} /></div>
                </div>

                <div></div>

                <div class="w-[100%]">
                    <div>
                        Sepia ({photoEffectsState.sepia})
                        <EffectsResetButton enabled={defaultPhotoEffects.sepia !== photoEffectsState.sepia} handleClick={() => setSepia(defaultPhotoEffects.sepia)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="100" step="1" value={photoEffectsState.sepia} onInput={evt => setSepia(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Saturation ({photoEffectsState.saturation}%)
                        <EffectsResetButton enabled={defaultPhotoEffects.saturation !== photoEffectsState.saturation} handleClick={() => setSaturation(defaultPhotoEffects.saturation)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="1000" step="1" value={photoEffectsState.saturation} onInput={evt => setSaturation(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Invert ({photoEffectsState.invert}%)
                        <EffectsResetButton enabled={defaultPhotoEffects.invert !== photoEffectsState.invert} handleClick={() => setInvert(defaultPhotoEffects.invert)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="100" step="1" value={photoEffectsState.invert} onInput={evt => setInvert(evt.currentTarget.valueAsNumber)} /></div>

                    <div>
                        Hue-Rotate ({photoEffectsState.hueRotate}&deg;)
                        <EffectsResetButton enabled={defaultPhotoEffects.hueRotate !== photoEffectsState.hueRotate} handleClick={() => setHueRotate(defaultPhotoEffects.hueRotate)} />
                    </div>
                    <div><input type="range" class="range range-sm" min="0" max="360" step="1" value={photoEffectsState.hueRotate} onInput={evt => setHueRotate(evt.currentTarget.valueAsNumber)} /></div>
                </div>
            </div>

            <button id="effect-reset" class="mt-4 btn btn-sm btn-error btn-outline" onClick={reset}>Reset</button>
        </>
    );
}

export default EffectsCard;
