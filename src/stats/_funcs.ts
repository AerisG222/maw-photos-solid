/*
   The three numbers the stats screen shows.

   These were `numbro`, which is a hundred kilobytes of the stats bundle because
   it ships every locale's formatting rules - to produce a thousands separator,
   an hours-minutes-seconds clock, and a byte unit. The platform does the first
   outright and the other two in a few lines.

   The output is deliberately identical to what numbro produced, sample for
   sample: this is a dependency leaving, not a redesign of how a figure reads.
*/
const counter = new Intl.NumberFormat();

export const formatCount = (v: number) => counter.format(v);

// `1:02:05` - hours are not padded, because 25 hours is a real answer here and
// truncating it to a clock face would be a lie
export const formatDuration = (v: number) => {
    const total = Math.max(0, Math.floor(v));
    const seconds = total % 60;
    const minutes = Math.floor(total / 60) % 60;
    const hours = Math.floor(total / 3600);
    const pad = (value: number) => String(value).padStart(2, "0");

    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
};

// decimal, as storage is sold and as the API reports it - a thousand bytes to
// the kilobyte, not 1024
const STORAGE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

export const formatStorage = (v: number) => {
    let size = Math.max(0, v);
    let unit = 0;

    while (size >= 1000 && unit < STORAGE_UNITS.length - 1) {
        size /= 1000;
        unit++;
    }

    return `${size.toFixed(2)} ${STORAGE_UNITS[unit]}`;
};

export type StatMode = "duration" | "size" | "count" | "category-count";

export const formatForMode = (mode: StatMode) => {
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

    throw Error(`Unexpected type: ${type}`);
};
