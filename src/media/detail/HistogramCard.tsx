import { Component, createEffect, createSignal } from 'solid-js';

import { useMediaListContext } from '../../contexts/MediaListContext';

type Histogram = {
    r: number[];
    g: number[];
    b: number[];
    lum: number[];
};

const HistogramCard: Component = () => {
    const _rgb = 'rgb';
    const _r = 'r';
    const _g = 'g';
    const _b = 'b';
    const _lum = 'lum';

    const [state] = useMediaListContext();
    const [channel, setChannel] = createSignal(_rgb);

    const img = document.createElement("img");
    let canvas: HTMLCanvasElement = undefined;
    img.setAttribute('crossorigin', 'anonymous');

    const updateHistogram = () => {
        renderHistogram(channel());
    };

    const renderHistogram = (channel: string) => {
        if(!canvas) {
            return;
        }

        let data = undefined;

        try {
            data = getImageData();
        } catch { }

        if(data) {
            const hist = calcHistogram(data);
            const maxCount = getMaxCount(channel, hist);

            drawHistogram(channel, hist, maxCount);
        }
    };

    const getImageData = (): Uint8ClampedArray => {
        const tempCanvas = document.createElement('canvas');

        tempCanvas.width = img.width;
        tempCanvas.height = img.height;

        const ctx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;

        ctx.drawImage(img, 0, 0);

        return ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
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

            if (channel === 'lum' && histogram.lum[i] > maxCount) {
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

    const drawHistogram = (
        channel: string,
        histogram: Histogram,
        maxCount: number
    ): void => {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'lighter';

        if (includeR(channel)) {
            drawHistogramChannel(ctx, '#f00', maxCount, histogram.r);
        }

        if (includeG(channel)) {
            drawHistogramChannel(ctx, '#0f0', maxCount, histogram.g);
        }

        if (includeB(channel)) {
            drawHistogramChannel(ctx, '#00f', maxCount, histogram.b);
        }

        if (channel === 'lum') {
            drawHistogramChannel(ctx, '#777', maxCount, histogram.lum);
        }

        ctx.globalCompositeOperation = 'source-over';
    };

    const drawHistogramChannel = (
        ctx: CanvasRenderingContext2D,
        color: string,
        maxCount: number,
        vals: number[]
    ): void => {
        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x, y, i = 0; i <= 255; i++) {
            if (!(i in vals)) {
                continue;
            }

            y = Math.round((vals[i] / maxCount) * canvas.height);
            x = Math.round((i / 255) * canvas.width);

            ctx.lineTo(x, canvas.height - y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    };

    img.onload = updateHistogram;

    createEffect(() => {
        if(state.activeItem) {
            img.src = state.activeItem.imageMdUrl;
        }
    });

    createEffect(() => {
        renderHistogram(channel());
    });

    return (
        <>
            <form class="flex justify-around">
                <label class="label cursor-pointer">
                    <input type="radio" name="channel" class="radio mr-2" checked={channel() === _rgb} onInput={() => setChannel(_rgb)} />
                    <span class="label-text">RGB</span>
                </label>
                <label class="label cursor-pointer">
                    <input type="radio" name="channel" class="radio mr-2" checked={channel() === _r} onInput={() => setChannel(_r)} />
                    <span class="label-text">R</span>
                </label>
                <label class="label cursor-pointer">
                    <input type="radio" name="channel" class="radio mr-2" checked={channel() === _g} onInput={() => setChannel(_g)} />
                    <span class="label-text">G</span>
                </label>
                <label class="label cursor-pointer">
                    <input type="radio" name="channel" class="radio mr-2" checked={channel() === _b} onInput={() => setChannel(_b)} />
                    <span class="label-text">B</span>
                </label>
                <label class="label cursor-pointer">
                    <input type="radio" name="channel" class="radio mr-2" checked={channel() === _lum} onInput={() => setChannel(_lum)} />
                    <span class="label-text">Luminance</span>
                </label>
            </form>
            <div>
                <canvas class="histogram" width="473px" height="200px" ref={canvas} />
            </div>
        </>
    );
};

export default HistogramCard;
