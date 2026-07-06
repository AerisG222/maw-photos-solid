import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import solidPlugin from "eslint-plugin-solid";
import pluginQuery from "@tanstack/eslint-plugin-query";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
    [globalIgnores(["**/dist/", "**/node_modules/", "**/*.mjs", "deploy/", "public/", "**/.venv/"])],
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        files: ["**/*.js", "**/*.ts", "**/*.tsx"],

        plugins: {
            ["@typescript-eslint"]: tseslint.plugin,
            "@tanstack/query": pluginQuery,
            solid: solidPlugin
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                google: "readonly"
            },

            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            },

            ecmaVersion: "latest",
            sourceType: "module"
        },

        rules: {
            "@tanstack/query/exhaustive-deps": "error",
            ...solidPlugin.configs.recommended.rules,

            // Solid types custom `use:` directives via `declare module "solid-js" { namespace JSX ... }`,
            // which is the required pattern, not a code smell.
            "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],

            // Note: you must disable the base rule as it can report incorrect errors
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error"
        }
    }
);
