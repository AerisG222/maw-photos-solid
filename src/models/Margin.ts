import { KeyValuePair } from './KeyValuePair';
import { equalsIgnoreCase } from './Utils';

export type MarginIdType = string;
export type Margin = KeyValuePair<MarginIdType> & { klass: any };

export const allMargins: Margin[] = [
    { id: 'dense',   name: 'Dense',   klass: { 'mx-[0%]': true } },
    { id: 'compact', name: 'Compact', klass: { 'mx-[8%]': true } },
    { id: 'comfy',   name: 'Comfy',   klass: { 'mx-[16%]': true } },
    { id: 'cozy',    name: 'Cozy',    klass: { 'mx-[24%]': true } },
];

export const allMarginClasses = new Set(allMargins
    .map(x => Object.keys(x.klass))
    .flat(1)
);

export const defaultMargin: MarginIdType = "compact";

export const getNextMarginSize = (margin: MarginIdType) => {
    var idx = allMargins.findIndex(x => equalsIgnoreCase(x.id, margin));

    if(idx === allMargins.length - 1) {
        idx = -1;
    }

    return allMargins[idx + 1];
}

export const getMarginClass = (margin: MarginIdType) => allMargins
        .filter(x => equalsIgnoreCase(x.id, margin))
        .map(x => x.klass)[0];
