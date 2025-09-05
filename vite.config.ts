import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcssPlugin from "@tailwindcss/vite";

export default defineConfig({
    envDir: "environments",
    plugins: [solidPlugin(), tailwindcssPlugin()],
    server: {
        host: "dev-photos.mikeandwan.us",
        port: 3000,
        https: {
            key: "/home/mmorano/maw-photos/dev/certificates/dev-photos.mikeandwan.us.pem",
            cert: "/home/mmorano/maw-photos/dev/certificates/dev-photos.mikeandwan.us.crt"
        }
    },
    build: {
        target: "esnext"
    },
    resolve: {
        conditions: ["development", "browser"]
    },
    test: {
        environment: "jsdom",
        globals: true,
        transformMode: { web: [/\.tsx?$/] },
        deps: { registerNodeLoader: true },
        threads: false,
        isolate: false
    }
});
