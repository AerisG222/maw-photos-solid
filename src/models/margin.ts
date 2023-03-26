import { ValueDescriptor } from './value-descriptor';

export enum Margin {
    dense = 'dense',
    compact = 'compact',
    comfy = 'comfy',
    cozy = 'cozy',
}

export const allMargins: ValueDescriptor<Margin>[] = [
    { value: Margin.dense, name: 'Dense' },
    { value: Margin.compact, name: 'Compact' },
    { value: Margin.comfy, name: 'Comfy' },
    { value: Margin.cozy, name: 'Cozy' },
];

export const toMargin = (val?: string | null): Margin | undefined => {
    if (!val) {
        return undefined;
    }

    return Margin[val as keyof typeof Margin];
};

export const toMarginDefaulted = (val?: string | null): Margin => {
    const margin = toMargin(val);

    return margin ? margin : Margin.compact;
};

export const nextMargin = (margin: Margin): Margin => {
    switch (margin) {
        case Margin.dense:
            return Margin.compact;
        case Margin.compact:
            return Margin.comfy;
        case Margin.comfy:
            return Margin.cozy;
        case Margin.cozy:
            return Margin.dense;
        default:
            console.error('invalid margin requested');
    }

    return Margin.compact;
};
