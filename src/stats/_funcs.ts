import numbro from "numbro";

export const formatCount = (v: number) => numbro(v).format({ thousandSeparated: true });

export const formatDuration = (v: number) => numbro(v).format({ output: "time" });

export const formatStorage = (v: number) =>
    numbro(v).format({ output: "byte", base: "decimal", mantissa: 2, spaceSeparated: true });

export const formatForMode = (mode: "duration" | "size" | "count" | "category-count") => {
    switch (mode) {
        case "duration":
            return formatDuration;
        case "size":
            return formatStorage;
        default:
            return formatCount;
    }
};

export const statbarMediaCountTitle = (type: string) => {
    switch (type) {
        case "photo":
            return "Photos";
        case "video":
            return "Videos";
        case "all":
            return "Photos & Videos";
    }

    throw Error("Unexpected type!");
};
