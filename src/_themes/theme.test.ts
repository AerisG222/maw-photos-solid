import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

import {
    ContrastPair,
    contrastPairs,
    requiredColorTokens,
    requiredScalarTokens
} from "./_contract";

const themeNames = ["light", "dark"] as const;

interface Oklch {
    l: number;
    c: number;
    h: number;
}

/*
   Read a theme stylesheet and pull out the tokens it states. Commented-out
   declarations are stripped first: both files carry a block of daisyUI defaults
   left in place as a reference, and those are exactly the tokens the contract
   exists to notice are missing.
*/
const readTheme = (name: string) => {
    const css = readFileSync(join(__dirname, `${name}.css`), "utf-8").replace(
        /\/\*[\s\S]*?\*\//g,
        ""
    );

    const tokens = new Map<string, string>();

    for (const match of css.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) {
        tokens.set(match[1], match[2].trim());
    }

    return tokens;
};

const themes = new Map(themeNames.map(name => [name, readTheme(name)]));

const parseOklch = (value: string): Oklch => {
    const match = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(value);

    if (!match) {
        throw new Error(`not an oklch() literal: ${value}`);
    }

    return { l: Number(match[1]) / 100, c: Number(match[2]), h: Number(match[3]) };
};

/*
   oklch -> linear sRGB. Out-of-gamut channels are clamped, which is what a
   browser renders anyway, so the ratio below reflects what someone actually
   sees rather than the theoretical color.
*/
const toLinearRgb = ({ l, c, h }: Oklch) => {
    const a = c * Math.cos((h * Math.PI) / 180);
    const b = c * Math.sin((h * Math.PI) / 180);

    const lp = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const mp = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const sp = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

    return [
        4.0767416621 * lp - 3.3077115913 * mp + 0.2309699292 * sp,
        -1.2684380046 * lp + 2.6097574011 * mp - 0.3413193965 * sp,
        -0.0041960863 * lp - 0.7034186147 * mp + 1.707614701 * sp
    ].map(channel => Math.min(1, Math.max(0, channel)));
};

// WCAG relative luminance, which wants linear-light channels - the same ones above
const luminance = (color: Oklch) => {
    const [r, g, b] = toLinearRgb(color);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (foreground: Oklch, background: Oklch) => {
    const a = luminance(foreground);
    const b = luminance(background);

    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

describe.each(themeNames)("the %s theme", name => {
    const tokens = themes.get(name)!;

    test.each([...requiredColorTokens, ...requiredScalarTokens])("states %s", token => {
        expect(tokens.get(token)).toBeDefined();
    });

    test.each(contrastPairs)(
        "$foreground on $background carries $where at $min:1",
        (pair: ContrastPair) => {
            const foreground = tokens.get(pair.foreground);
            const background = tokens.get(pair.background);

            expect(foreground, `${name} does not state ${pair.foreground}`).toBeDefined();
            expect(background, `${name} does not state ${pair.background}`).toBeDefined();

            const ratio = contrastRatio(parseOklch(foreground!), parseOklch(background!));

            expect(
                Number(ratio.toFixed(2)),
                `${pair.foreground} on ${pair.background} (${pair.where}) is ${ratio.toFixed(2)}:1`
            ).toBeGreaterThanOrEqual(pair.min);
        }
    );
});

/*
   The themes are allowed to look different; they are not allowed to disagree
   about what exists. A token stated in one and derived in the other is the drift
   this whole contract is here to catch.
*/
test("both themes state the same set of tokens", () => {
    const [light, dark] = themeNames.map(name => [...themes.get(name)!.keys()].sort());

    expect(light).toEqual(dark);
});
