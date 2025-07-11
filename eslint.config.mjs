import { dirname } from "path"
import { fileURLToPath } from "url"

import { FlatCompat } from "@eslint/eslintrc"
import tailwind from "eslint-plugin-tailwindcss"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // Base configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // TailwindCSS plugin
  {
    plugins: {
      tailwindcss: tailwind,
    },
    rules: {
      "no-console": ["error", { allow: ["info", "warn", "error"] }],
      "tailwindcss/classnames-order": "error",
      "tailwindcss/no-custom-classname": ["warn"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // TypeScript parser configuration
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
    },
  },
]

export default eslintConfig
