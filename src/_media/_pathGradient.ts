/*
   The colors a trip path runs through, start to end.

   From the viridis scale, as it reads in order to everyone - a red-green
   gradient looks the same at both ends to about one man in twelve - because it
   grows lighter as well as changing hue. Its darkest purple is left off, as it
   would vanish against satellite imagery. Several stops rather than blue
   straight to yellow, which would pass through a muddy gray on the way.
*/
export const pathStartColor = "#2f6fde";
export const pathEndColor = "#fde725";

export const pathStops = [pathStartColor, "#21a6a6", "#6cce59", pathEndColor];

type Rgb = [number, number, number];

const toRgb = (hex: string): Rgb => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16)
];

const toHex = (rgb: Rgb) =>
    `#${rgb.map(c => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

// the color a fraction of the way along the path, 0 at the start and 1 at the end
export const pathColorAt = (fraction: number) => {
    const clamped = Math.min(1, Math.max(0, fraction));
    const scaled = clamped * (pathStops.length - 1);
    const index = Math.min(Math.floor(scaled), pathStops.length - 2);
    const within = scaled - index;
    // the index is clamped to a pair of neighboring stops, so both are there
    const [r1, g1, b1] = toRgb(pathStops[index] ?? pathStartColor);
    const [r2, g2, b2] = toRgb(pathStops[index + 1] ?? pathEndColor);
    const mix = (a: number, b: number) => a + (b - a) * within;

    return toHex([mix(r1, r2), mix(g1, g2), mix(b1, b2)]);
};

/*
   One color for each hop between consecutive photos. The first hop is the
   start color and the last the end color, so the path meets the start and end
   markers in their own colors.
*/
export const pathSegmentColors = (segmentCount: number) =>
    Array.from({ length: segmentCount }, (_, i) =>
        pathColorAt(segmentCount === 1 ? 0.5 : i / (segmentCount - 1))
    );
