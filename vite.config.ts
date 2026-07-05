import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcssPlugin from "@tailwindcss/vite";
import type { InlineConfig as VitestInlineConfig } from "vitest/node";

// Teach vite's config type about the vitest `test` block. Importing vitest's own
// `defineConfig` blows the type-instantiation depth against vite 8, so we augment
// the interface directly instead.
declare module "vite" {
    interface UserConfig {
        test?: VitestInlineConfig;
    }
}

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
        isolate: false
    }
});
