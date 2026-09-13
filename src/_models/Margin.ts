import { KeyValuePair } from "./KeyValuePair";
import { equalsIgnoreCase } from "./utils/StringUtils";

export type MarginIdType = string;
export type Margin = KeyValuePair<MarginIdType> & { klass: Record<string, boolean | undefined> };

const dense = { id: "dense", name: "Dense", klass: { "mx-[0%]": true } };
const compact = { id: "compact", name: "Compact", klass: { "mx-[8%]": true } };
const comfy = { id: "comfy", name: "Comfy", klass: { "mx-[16%]": true } };
const cozy = { id: "cozy", name: "Cozy", klass: { "mx-[24%]": true } };

const allMargins: Margin[] = [dense, compact, comfy, cozy];

export const getMarginClass = (margin: MarginIdType | undefined) =>
    margin
        ? allMargins.filter(x => equalsIgnoreCase(x.id, margin)).map(x => x.klass)[0]
        : undefined;
