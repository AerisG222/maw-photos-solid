import { defineConfig } from '@unocss/vite';
import type { Theme } from '@unocss/preset-uno';
import { presetUno } from '@unocss/preset-uno';
import { presetIcons } from '@unocss/preset-icons';
import { presetDaisy } from 'unocss-preset-daisy';
import { presetScrollbar } from 'unocss-preset-scrollbar';

import { allRouteIcons } from './src/routes';
import { getThemesForUno } from './src/_models/Theme';
import { allThumbnailClasses } from './src/_models/ThumbnailSize';
import { allMarginClasses } from './src/_models/Margin';
import { categoryTypeIcons } from './src/_models/CategoryTypes';

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
            themes: getThemesForUno()
        }),
        presetScrollbar({
            scrollbarWidth: '10px',
            scrollbarHeight: '10px',
            scrollbarTrackRadius: 0,
            scrollbarThumbRadius: '5px',
        }),
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
            head3: 'font-bold text-lg mt-3 color-secondary',
            scrollable: 'scrollbar scrollbar-rounded scrollbar-track-color-[hsl(var(--b3))] scrollbar-thumb-color-[hsl(var(--bc))]'
        }
    ]
});
