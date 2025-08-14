import numbro from "numbro";

const sizeAgg = d => d.totalSize;
const sizeFmt = v =>
    numbro(v).format({ output: "byte", base: "decimal", mantissa: 2, spaceSeparated: true });

const countAgg = d => (d.children ? 0 : d.count);
const countFmt = v => numbro(v).format({ thousandSeparated: true });

const durationAgg = d => d.totalDuration;
const durationFmt = v => numbro(v).format({ output: "time" });

export const getAggFuncs = (mode: string) => {
    if (mode === "size") {
        return {
            agg: sizeAgg,
            fmt: sizeFmt
        };
    }

    if (mode === "duration") {
        return {
            agg: durationAgg,
            fmt: durationFmt
        };
    }

    return {
        agg: countAgg,
        fmt: countFmt
    };
};
