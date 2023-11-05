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

// **
// when updating from vite-plugin-solid@2.7.0 to something newer, some styles were lost / missing
// by uno.  Interestingly, if we add a space after the name where it is used in the class, then
// it seems to work oddly enough.  alternatively, adding these here to the following list will
// add them to the safelist below to ensure they are present, w/o the space hack that likely
// will be deleted in the future when i forget about that hack and why it is there
// **
const LOST_STYLES = [
    "head1",   // lost on settings and help pages
    "head2",   // lost on settings pages
    "head3",   // added for good measure
    "mt-4",     // margin above search term input box
    "mt-auto",  // see missing gps filter checkbox
    "relative"  // see video icon on category grid view
];

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
            scrollbarTrackRadius: "0px",
            scrollbarThumbRadius: "5px",
        }),
    ],
    safelist: [
        ...allRouteIcons,
        ...allMarginClasses,
        ...categoryTypeIcons,
        ...LOST_STYLES
    ],
    shortcuts: [
        {
            head1: "font-bold text-lg mt-2 mb-2 color-primary",
            head2: "font-bold mt-1 mb-1 color-primary",
            head3: "font-bold text-sm mt-1 mb-1 color-secondary",
            scrollable: "scrollbar scrollbar-rounded scrollbar-track-color-[hsla(var(--b3))] scrollbar-thumb-color-[hsla(var(--bc))]"
        }
    ]
});
