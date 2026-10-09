/*
   The colors a trip path runs through, start to end.

   From the viridis scale, as it reads in order to everyone - a red-green
   gradient looks the same at both ends to about one man in twelve - because it
   grows lighter as well as changing hue. Its darkest purple is left off, as it
   would vanish against satellite imagery. Several stops rather than blue
   straight to yellow, which would pass through a muddy gray on the way.
*/
export const pathStops = ["#2f6fde", "#21a6a6", "#6cce59", "#fde725"];

export const pathStartColor = pathStops[0];
export const pathEndColor = pathStops[pathStops.length - 1];

const toRgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

const toHex = (rgb: number[]) =>
    `#${rgb.map(c => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

// the color a fraction of the way along the path, 0 at the start and 1 at the end
export const pathColorAt = (fraction: number) => {
    const clamped = Math.min(1, Math.max(0, fraction));
    const scaled = clamped * (pathStops.length - 1);
    const index = Math.min(Math.floor(scaled), pathStops.length - 2);
    const within = scaled - index;
    const from = toRgb(pathStops[index]);
    const to = toRgb(pathStops[index + 1]);

    return toHex(from.map((c, i) => c + (to[i] - c) * within));
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
