import { defineConfig } from '@unocss/vite';
import { presetMini } from '@unocss/preset-mini';
import { presetIcons } from '@unocss/preset-icons';

export default defineConfig({
    presets: [
        presetIcons(),
        presetMini()
    ],
});
