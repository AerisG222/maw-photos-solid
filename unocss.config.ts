import { defineConfig } from '@unocss/vite';
import type { Theme } from '@unocss/preset-mini';
import { presetMini } from '@unocss/preset-mini';
import { presetIcons } from '@unocss/preset-icons';
import { presetDaisy } from 'unocss-preset-daisy';

import { allRouteIcons } from './src/routes';
import { allThemes } from './src/models/Theme';
import { allThumbnailClasses } from './src/models/ThumbnailSize';

export default defineConfig<Theme>({
    presets: [
        presetIcons({
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            }
        }),
        presetMini(),
        presetDaisy({
            themes: allThemes.map(x => x.id)
        })
    ],
    safelist: [
        ...allRouteIcons,
        ...allThumbnailClasses
    ],
    shortcuts: [
        {
            head1: 'font-bold text-xl mb-3 color-primary',
            head2: 'font-bold text-lg mb-3 color-primary',
        }
    ]
});
