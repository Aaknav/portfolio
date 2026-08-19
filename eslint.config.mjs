import next from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";

/**
 * Lint runs on ESLint 10 with the Next.js and React Hooks plugins.
 *
 * Deliberately NOT using eslint-config-next: it depends on typescript-eslint,
 * which declares `typescript: <6.1.0` and hard-errors on TypeScript 7. Type
 * safety is covered by `npm run typecheck` (tsc --noEmit, strict) instead.
 * Revisit once typescript-eslint ships TS 7 support.
 */
const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  next.configs["core-web-vitals"],
  reactHooks.configs.flat["recommended-latest"],
];

export default config;
