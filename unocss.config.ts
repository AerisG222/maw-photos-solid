import { defineConfig } from '@unocss/vite';
import { presetMini } from '@unocss/preset-mini';
import { presetIcons } from '@unocss/preset-icons';
import { appRoutes } from './src/routes';

export default defineConfig({
    presets: [
        presetIcons({
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            }
        }),
        presetMini()
    ],
    safelist: [
        ...new Set(appRoutes.filter(r => !!r.icon).map(r => r.icon))
    ]
});
