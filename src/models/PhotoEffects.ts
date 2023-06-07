export type PhotoEffectsState = {
    readonly grayscale: number;
    readonly sepia: number;
    readonly brightness: number;
    readonly saturation: number;
    readonly contrast: number;
    readonly invert: number;
    readonly blur: number;
    readonly hueRotate: number;
};

export const defaultPhotoEffects: PhotoEffectsState = {
    grayscale: 0,
    sepia: 0,
    brightness: 100,
    saturation: 100,
    contrast: 100,
    invert: 0,
    blur: 0,
    hueRotate: 0
};
