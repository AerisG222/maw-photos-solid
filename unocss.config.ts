import { defineConfig } from '@unocss/vite';
import type { Theme } from '@unocss/preset-uno';
import { presetUno } from '@unocss/preset-uno';
import { presetIcons } from '@unocss/preset-icons';
import { presetDaisy } from 'unocss-preset-daisy';

//import { allRouteIcons } from './src/routes';
import { allThemes } from './src/_models/Theme';
import { allThumbnailClasses } from './src/_models/ThumbnailSize';
import { allMarginClasses } from './src/_models/Margin';

// ideally this would be a query against categoryTypes, but due to the imports
// in that file it can not be used, so we must use the list below to avoid the
// dependencies there...
const categoryTypeIcons = [
    "i-ic-round-camera-alt",
    "i-ic-round-videocam"
];

// uh oh - now we have the same issue for route icons...
const allRouteIcons = [
    "i-ic-outline-apps",
    "i-ic-round-dashboard",
    "i-ic-round-fullscreen",
    "i-ic-round-map",
    "i-ic-round-collections",
    "i-ic-round-format-list-bulleted",
    "i-ic-round-home",
    "i-ic-round-search",
    "i-ic-round-image",
    "i-ic-round-videocam",
    "i-ic-round-shuffle",
    "i-ic-baseline-settings",
    "i-ic-outline-photo-camera",
    "i-ic-round-functions",
    "i-ic-round-bar-chart"
];

export default defineConfig<Theme>({
    presets: [
        presetIcons({
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            }
        }),
        presetUno(),
        presetDaisy({
            themes: allThemes.map(x => x.id)
        })
    ],
    safelist: [
        ...allRouteIcons,
        ...allMarginClasses,
        ...allThumbnailClasses,
        ...categoryTypeIcons
    ],
    shortcuts: [
        {
            head1: 'font-bold text-xl mb-3 color-primary',
            head2: 'font-bold text-lg mb-3 color-primary',
            head3: 'font-bold text-lg mt-3 color-accent'
        }
    ]
});
