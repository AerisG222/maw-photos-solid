import { KeyValuePair } from "./KeyValuePair";
import { equalsIgnoreCase } from "./utils/StringUtils";

export type MarginIdType = string;
export type Margin = KeyValuePair<MarginIdType> & { klass: Record<string, boolean | undefined> };

const dense = { id: "dense", name: "Dense", klass: { "mx-[0%]": true } };
const compact = { id: "compact", name: "Compact", klass: { "mx-[8%]": true } };
const comfy = { id: "comfy", name: "Comfy", klass: { "mx-[16%]": true } };
const cozy = { id: "cozy", name: "Cozy", klass: { "mx-[24%]": true } };

export const allMargins: Margin[] = [
    dense,
    compact,
    comfy,
    cozy
];

export const allMarginClasses = new Set(allMargins.map(x => Object.keys(x.klass)).flat(1));

export const defaultMargin: MarginIdType = "compact";

export const getNextMarginSize = (margin: MarginIdType) => {
    let idx = allMargins.findIndex(x => equalsIgnoreCase(x.id, margin));

    if (idx === allMargins.length - 1) {
        idx = -1;
    }

    return allMargins[idx + 1];
};

export const getMarginClass = (margin: MarginIdType | undefined) =>
    margin
        ? allMargins.filter(x => equalsIgnoreCase(x.id, margin)).map(x => x.klass)[0]
        : compact.klass;
