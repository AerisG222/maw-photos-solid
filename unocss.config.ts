import { defineConfig } from '@unocss/vite';
import type { Theme } from '@unocss/preset-mini';
import { presetMini } from '@unocss/preset-mini';
import { presetIcons } from '@unocss/preset-icons';
import { presetDaisy } from 'unocss-preset-daisy';

import { appRoutes } from './src/routes';
import { allThemes } from './src/models/Theme';

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
        ...new Set(appRoutes.filter(r => !!r.icon).map(r => r.icon))
    ],
    shortcuts: [
        {
            head1: 'font-bold text-xl mb-3',
            head2: 'font-bold text-lg mb-3',
        }
    ]
});
