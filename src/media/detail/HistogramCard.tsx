import { Component, createEffect, createSignal } from "solid-js";

type Histogram = {
    r: number[];
    g: number[];
    b: number[];
    lum: number[];
};

type Props = {
    mediaElement?: HTMLImageElement | HTMLVideoElement;
};

const HistogramCard: Component<Props> = props => {
    const _rgb = "rgb";
    const _r = "r";
    const _g = "g";
    const _b = "b";
    const _lum = "lum";

    const [channel, setChannel] = createSignal(_rgb);
    const [histogram, setHistogram] = createSignal({
        r: [],
        g: [],
        b: [],
        lum: []
    });

    let histogramCanvas: HTMLCanvasElement;
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d", {
        willReadFrequently: true
    }) as CanvasRenderingContext2D;

    const renderHistogram = (histogram: Histogram, channel: string) => {
        if (histogram) {
            const maxCount = getMaxCount(channel, histogram);

            drawHistogram(channel, histogram, maxCount);
        } else {
            console.log("histogram null");
        }
    };

    const updateHistogramFromImage = (img: HTMLImageElement): void => {
        tempCanvas.width = img.naturalWidth ? img.naturalWidth : img.width;
        tempCanvas.height = img.naturalHeight ? img.naturalHeight : img.height;

        tempCtx.drawImage(img, 0, 0);

        const data = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;

        setHistogram(calcHistogram(data));
    };

    const updateHistogramFromVideoFrame = async (timestamp, frame) => {
        const video = props.mediaElement as HTMLVideoElement;
        const bitmap = await createImageBitmap(video);

        updateHistogramFromImage(bitmap);

        if (!video.ended) {
            video.requestVideoFrameCallback(updateHistogramFromVideoFrame);
        }
    };

    const getMaxCount = (channel: string, histogram: Histogram): number => {
        let maxCount = 0;

        for (let i = 0; i < 256; i++) {
            if (includeR(channel) && histogram.r[i] > maxCount) {
                maxCount = histogram.r[i];
            }

            if (includeG(channel) && histogram.g[i] > maxCount) {
                maxCount = histogram.g[i];
            }

            if (includeB(channel) && histogram.b[i] > maxCount) {
                maxCount = histogram.b[i];
            }

            if (channel === "lum" && histogram.lum[i] > maxCount) {
                maxCount = histogram.lum[i];
            }
        }

        return maxCount;
    };

    const includeR = (channel: string): boolean => channel === _rgb || channel === _r;
    const includeG = (channel: string): boolean => channel === _rgb || channel === _g;
    const includeB = (channel: string): boolean => channel === _rgb || channel === _b;

    const getLuma = (r: number, g: number, b: number): number => {
        // https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        return Math.round(luma);
    };

    // inspiration:
    //   http://mihai.sucan.ro/coding/svg-or-canvas/histogram.html
    //   https://thmsdnnr.com/projects/2018/03/09/draw-photo-histograms-d3-canvas.html
    const calcHistogram = (data: Uint8ClampedArray): Histogram => {
        const r = [];
        const g = [];
        const b = [];
        const lum = [];

        for (let i = 0; i < 256; i++) {
            r[i] = 0;
            g[i] = 0;
            b[i] = 0;
            lum[i] = 0;
        }

        // 4 because each pixel is stored as 4 consecutive elements: R G B A
        for (let i = 0; i < data.length; i += 4) {
            r[data[i + 0]]++;
            g[data[i + 1]]++;
            b[data[i + 2]]++;
            lum[getLuma(data[i + 0], data[i + 1], data[i + 2])]++;
        }

        return { r, g, b, lum };
    };

    const drawHistogram = (channel: string, histogram: Histogram, maxCount: number): void => {
        const ctx = histogramCanvas!.getContext("2d") as CanvasRenderingContext2D;

        ctx.clearRect(0, 0, histogramCanvas!.width, histogramCanvas!.height);

        ctx.globalCompositeOperation = "lighter";

        if (includeR(channel)) {
            drawHistogramChannel(ctx, "#f00", maxCount, histogram.r);
        }

        if (includeG(channel)) {
            drawHistogramChannel(ctx, "#0f0", maxCount, histogram.g);
        }

        if (includeB(channel)) {
            drawHistogramChannel(ctx, "#00f", maxCount, histogram.b);
        }

        if (channel === "lum") {
            drawHistogramChannel(ctx, "#777", maxCount, histogram.lum);
        }

        ctx.globalCompositeOperation = "source-over";
    };

    const drawHistogramChannel = (
        ctx: CanvasRenderingContext2D,
        color: string,
        maxCount: number,
        vals: number[]
    ): void => {
        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.moveTo(0, histogramCanvas!.height);

        for (let x, y, i = 0; i <= 255; i++) {
            if (!(i in vals)) {
                continue;
            }

            y = Math.round((vals[i] / maxCount) * histogramCanvas!.height);
            x = Math.round((i / 255) * histogramCanvas!.width);

            ctx.lineTo(x, histogramCanvas!.height - y);
        }

        ctx.lineTo(histogramCanvas!.width, histogramCanvas!.height);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    };

    createEffect(() => {
        const el = props.mediaElement;

        if (!el) {
            return;
        }

        if (el.nodeName === "IMG") {
            const img = el as HTMLImageElement;

            img.onload = async () => {
                await img.decode();

                updateHistogramFromImage(img);
            };
        }

        if (el.nodeName === "VIDEO") {
            (el as HTMLVideoElement).requestVideoFrameCallback(updateHistogramFromVideoFrame);
        }
    });

    createEffect(() => {
        renderHistogram(histogram(), channel());
    });

    // render the initial histogram if media is already loaded
    if (props.mediaElement) {
        const el = props.mediaElement;

        if (el.nodeName === "IMG" && (props.mediaElement as HTMLImageElement).complete) {
            updateHistogramFromImage(el as HTMLImageElement);
        } else if (el.nodeName === "VIDEO") {
            updateHistogramFromVideoFrame(null, null);
        }
    }

    return (
        <>
            <form class="flex justify-around">
                <label class="label cursor-pointer">
                    <input
                        type="radio"
                        name="channel"
                        class="radio mr-2"
                        checked={channel() === _rgb}
                        onInput={() => setChannel(_rgb)}
                    />
                    <span class="label-text">RGB</span>
                </label>
                <label class="label cursor-pointer">
                    <input
                        type="radio"
                        name="channel"
                        class="radio mr-2"
                        checked={channel() === _r}
                        onInput={() => setChannel(_r)}
                    />
                    <span class="label-text">R</span>
                </label>
                <label class="label cursor-pointer">
                    <input
                        type="radio"
                        name="channel"
                        class="radio mr-2"
                        checked={channel() === _g}
                        onInput={() => setChannel(_g)}
                    />
                    <span class="label-text">G</span>
                </label>
                <label class="label cursor-pointer">
                    <input
                        type="radio"
                        name="channel"
                        class="radio mr-2"
                        checked={channel() === _b}
                        onInput={() => setChannel(_b)}
                    />
                    <span class="label-text">B</span>
                </label>
                <label class="label cursor-pointer">
                    <input
                        type="radio"
                        name="channel"
                        class="radio mr-2"
                        checked={channel() === _lum}
                        onInput={() => setChannel(_lum)}
                    />
                    <span class="label-text">Luminance</span>
                </label>
            </form>
            <div>
                <canvas class="histogram" width="473px" height="200px" ref={histogramCanvas} />
            </div>
        </>
    );
};

export default HistogramCard;
