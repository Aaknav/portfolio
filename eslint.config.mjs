import next from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

/**
 * Lint runs on ESLint 10 with type-aware rules.
 *
 * TypeScript is deliberately pinned to the 6.0.x line: typescript-eslint
 * declares `typescript: <6.1.0`, and without its parser ESLint cannot read a
 * .ts or .tsx file at all — flat config would silently lint the two .mjs config
 * files, report success, and leave every source file unchecked.
 *
 * The type-checked preset is the point of the exercise. `tsc --noEmit` proves
 * the types line up; these rules catch the things that typecheck cleanly and
 * still break at runtime — a promise nobody awaited, an async function handed
 * to something expecting void.
 */
export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "test-results/**",
      "playwright-report/**",
      "coverage/**",
    ],
  },

  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts"],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  /* The .mjs config files have no project to draw type information from. */
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    extends: [tseslint.configs.disableTypeChecked],
  },

  next.configs["core-web-vitals"],
  reactHooks.configs.flat["recommended-latest"],
);
