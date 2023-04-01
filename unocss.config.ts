import { defineConfig } from '@unocss/vite';
import type { Theme } from '@unocss/preset-mini';
import { presetMini } from '@unocss/preset-mini';
import { presetIcons } from '@unocss/preset-icons';
import presetTheme from 'unocss-preset-theme';

import { appRoutes } from './src/routes';

export default defineConfig<Theme>({
    theme: {
        colors: {
            'bg': '#fff',
            'text': '#333'
        }
    },
    presets: [
        presetIcons({
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            }
        }),
        presetMini(),
        presetTheme<Theme>({
            theme: {
                dark: {
                    colors: {
                        'bg': '#222',
                        'text': '#ccc'
                    }
                }
            }
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
