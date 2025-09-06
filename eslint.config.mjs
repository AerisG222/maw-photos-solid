import { defineConfig, globalIgnores } from "eslint/config";
import solidPlugin from "eslint-plugin-solid";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/dist", "**/node_modules"]), {
    extends: compat.extends("eslint:recommended"),

    files: ["**/*.ts", "**/*.tsx"],

    plugins: {
        solid: solidPlugin,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            google: "readonly",
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
    },

    rules: {
        ...solidPlugin.configs.recommended.rules,
    }
}]);
