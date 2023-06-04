import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import UnocssPlugin from '@unocss/vite';

export default defineConfig({
    envDir: 'environments',
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
    resolve: {
        conditions: ['development', 'browser'],
    },
    test: {
        environment: 'jsdom',
        globals: true,
        transformMode: { web: [/\.tsx?$/] },
        deps: { registerNodeLoader: true },
        threads: false,
        isolate: false,
    }
});
