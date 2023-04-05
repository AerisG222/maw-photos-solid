import { KeyValuePair } from './KeyValuePair';

export type MarginIdType = string;
export type Margin = KeyValuePair<MarginIdType>;

export const allMargins: Margin[] = [
    { id: 'dense',   name: 'Dense' },
    { id: 'compact', name: 'Compact' },
    { id: 'comfy',   name: 'Comfy' },
    { id: 'cozy',    name: 'Cozy' },
];

export const defaultMargin: MarginIdType = "compact";
