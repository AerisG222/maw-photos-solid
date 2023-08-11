import { defineConfig } from "@unocss/vite";
import type { Theme } from "@unocss/preset-uno";
import { presetUno } from "@unocss/preset-uno";
import { presetIcons } from "@unocss/preset-icons";
import { presetDaisy } from "unocss-preset-daisy";
import { presetScrollbar } from "unocss-preset-scrollbar";
import presetWebFonts from "@unocss/preset-web-fonts";

import { allRouteIcons } from "./src/routes";
import { getThemesForUno } from "./src/_models/Theme";
import { allMarginClasses } from "./src/_models/Margin";
import { categoryTypeIcons } from "./src/_models/CategoryTypes";

export default defineConfig<Theme>({
    presets: [
        presetIcons({
            extraProperties: {
                "display": "inline-block",
                "vertical-align": "middle",
            }
        }),
        presetUno(),
        presetWebFonts({
            provider: "google",
            fonts: {
                sans: "Nunito Sans",
                brand: "Tangerine"
            }
        }),
        presetDaisy({
            themes: getThemesForUno()
        }),
        presetScrollbar({
            scrollbarWidth: "10px",
            scrollbarHeight: "10px",
            scrollbarTrackRadius: 0,
            scrollbarThumbRadius: "5px",
        }),
    ],
    safelist: [
        ...allRouteIcons,
        ...allMarginClasses,
        ...categoryTypeIcons
    ],
    shortcuts: [
        {
            head1: "font-bold text-lg mt-2 mb-2 color-primary",
            head2: "font-bold mt-1 mb-1 color-primary",
            head3: "font-bold text-sm mt-1 mb-1 color-secondary",
            scrollable: "scrollbar scrollbar-rounded scrollbar-track-color-[hsl(var(--b3))] scrollbar-thumb-color-[hsl(var(--bc))]"
        }
    ]
});
