import { defineConfig } from '@unocss/vite';
import type { Theme } from '@unocss/preset-uno';
import { presetUno } from '@unocss/preset-uno';
import { presetIcons } from '@unocss/preset-icons';
import { presetDaisy } from 'unocss-preset-daisy';

import { allRouteIcons } from './src/routes';
import { allThemes } from './src/models/Theme';
import { allThumbnailClasses } from './src/models/ThumbnailSize';
import { allMarginClasses } from './src/models/Margin';
import { allCategoryTypeIcons } from './src/models/CategoryTypeFilter';

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
        ...allCategoryTypeIcons
    ],
    shortcuts: [
        {
            head1: 'font-bold text-xl mb-3 color-primary',
            head2: 'font-bold text-lg mb-3 color-primary',
        }
    ]
});
