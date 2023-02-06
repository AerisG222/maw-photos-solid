import { defineConfig } from '@unocss/vite';
import { presetMini } from '@unocss/preset-mini';
import { presetIcons } from '@unocss/preset-icons';

export default defineConfig({
    presets: [
        presetIcons(),
        presetMini()
    ],
    safelist: [
        "i-ic-round-home",
        "i-ic-round-search",
        "i-ic-round-shuffle",
        "i-ic-round-bar-chart",
        "i-ic-outline-info",
        "i-ic-baseline-settings",
    ]
});
