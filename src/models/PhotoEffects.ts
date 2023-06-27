export type PhotoEffectsState = {
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

export const defaultPhotoEffects: PhotoEffectsState = {
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
