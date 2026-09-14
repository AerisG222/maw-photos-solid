import { KeyValuePair } from "./KeyValuePair";
import {
    ThumbnailSizeDefault,
    ThumbnailSizeIdType,
    ThumbnailSizeSmall,
    ThumbnailSizeTiny,
    ThumbnailSizeVerySmall
} from "./ThumbnailSize";

/*
   How much of the screen a listing gives each item.

   This replaces two independent controls - a four-step thumbnail size and a
   four-step page margin - which between them could express sixteen
   combinations of one idea. Three named steps, and the surface decides what
   each means for it: the same "compact" is a different number of pixels in a
   grid of photographs than in a list of rows.
*/
export const DensityComfortable = "comfortable";
export const DensityCompact = "compact";
export const DensityDense = "dense";

export type DensityIdType = typeof DensityComfortable | typeof DensityCompact | typeof DensityDense;

export const allDensities: KeyValuePair<DensityIdType>[] = [
    { id: DensityComfortable, name: "Comfortable" },
    { id: DensityCompact, name: "Compact" },
    { id: DensityDense, name: "Dense" }
];

/*
   Comfortable reproduces what the application shipped with - the default
   thumbnail size, the default list size and the default margin - so a reader
   who never touched either of the old controls sees no change at all. The
   other two steps tighten from there.
*/
export const defaultDensity: DensityIdType = DensityComfortable;

interface DensityGeometry {
    readonly grid: ThumbnailSizeIdType;
    readonly list: ThumbnailSizeIdType;
    // the `.stage-*` class that caps how wide the content runs
    readonly stage: string;
}

const geometry: Record<DensityIdType, DensityGeometry> = {
    [DensityComfortable]: {
        grid: ThumbnailSizeDefault,
        list: ThumbnailSizeVerySmall,
        stage: "stage-compact"
    },
    [DensityCompact]: {
        grid: ThumbnailSizeSmall,
        list: ThumbnailSizeVerySmall,
        stage: "stage-dense"
    },
    [DensityDense]: {
        grid: ThumbnailSizeVerySmall,
        list: ThumbnailSizeTiny,
        stage: "stage-dense"
    }
};

const densityOrder: DensityIdType[] = [DensityComfortable, DensityCompact, DensityDense];

export const getDensity = (density: DensityIdType) => geometry[density] ?? geometry[defaultDensity];

export const getGridThumbnailSize = (density: DensityIdType) => getDensity(density).grid;

export const getListThumbnailSize = (density: DensityIdType) => getDensity(density).list;

export const getDensityStage = (density: DensityIdType) => getDensity(density).stage;

export const getNextDensity = (density: DensityIdType): DensityIdType => {
    const idx = densityOrder.indexOf(density);

    return densityOrder[(idx + 1) % densityOrder.length];
};

/*
   The reverse mapping, for the toolbars that still speak in thumbnail sizes
   while they wait to be replaced by the shared listing toolbar. A size that no
   density produces resolves to the nearest one that is no larger, so cycling
   through the old control still walks the new steps in order.
*/
export const getDensityForThumbnailSize = (size: ThumbnailSizeIdType): DensityIdType => {
    switch (size) {
        case ThumbnailSizeDefault:
            return DensityComfortable;
        case ThumbnailSizeSmall:
            return DensityCompact;
        default:
            return DensityDense;
    }
};
