import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    // Next.js + TypeScript compatibility
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    // Your custom rules
    {
        plugins: {
            prettier: pluginPrettier,
        },
        rules: {
            // Enforce double quotes
            quotes: ["error", "double"],

            // Enforce 4 spaces
            indent: ["error", 4],

            // Prettier integration
            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    tabWidth: 4,
                    useTabs: false,
                },
            ],
        },
    },

    // Disable conflicting rules from ESLint that Prettier handles
    prettier,
];

export default eslintConfig;
