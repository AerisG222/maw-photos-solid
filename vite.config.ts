import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcssPlugin from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
    envDir: "environments",
    plugins: [solidPlugin(), tailwindcssPlugin(), basicSsl()],
    server: {
        host: "dev-photos.mikeandwan.us",
        port: 3000
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
