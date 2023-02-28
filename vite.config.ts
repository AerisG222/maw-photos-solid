import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import UnocssPlugin from '@unocss/vite';

export default defineConfig({
    plugins: [
        solidPlugin(),
        UnocssPlugin(),
    ],
    server: {
        //host: 'dev.photos.mikeandwan.us',
        port: 3000,
    },
    build: {
        target: 'esnext',
    },
    envDir: 'environments'
});
