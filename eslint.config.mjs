import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import solidPlugin from "eslint-plugin-solid";
import pluginQuery from "@tanstack/eslint-plugin-query";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
    [
        globalIgnores([
            "**/dist/",
            "**/node_modules/",
            "**/*.mjs",
            "deploy/",
            "public/",
            "**/.venv/"
        ])
    ],
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
            // exhaustive-deps assumes React's re-render model. Solid provider bodies run once,
            // so the fetch closures referenced by queryFn are stable and never go stale, yet the
            // rule flags them on every well-formed query. Disabled; keeping the varying values in
            // each queryKey (e.g. the media id / year) is enforced by convention and code review.
            "@tanstack/query/exhaustive-deps": "off",
            ...solidPlugin.configs.recommended.rules,

            // Solid compiles `ref={el}` into an assignment to `el`, but that rewrite happens in
            // the JSX transform, so eslint's static analysis only ever sees the bare declaration.
            // Every ref variable in the codebase trips this rule; it is a false positive, not a bug.
            "no-unassigned-vars": "off",

            // Solid types custom `use:` directives via `declare module "solid-js" { namespace JSX ... }`,
            // which is the required pattern, not a code smell.
            "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],

            // Async handlers on JSX attributes (onClick, onSave, ...) are idiomatic in Solid and
            // safe to fire-and-forget; still flag promise-returning fns passed as plain arguments.
            "@typescript-eslint/no-misused-promises": [
                "error",
                { checksVoidReturn: { attributes: false } }
            ],

            // Note: you must disable the base rule as it can report incorrect errors
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_"
                }
            ]
        }
    },
    {
        // Testing Library queries are pre-bound, so destructuring them off `render()`
        // does not risk an unbound `this`.
        files: ["**/*.test.ts", "**/*.test.tsx"],
        rules: {
            "@typescript-eslint/unbound-method": "off"
        }
    }
);
