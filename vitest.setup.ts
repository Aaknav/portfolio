import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/* RTL does not auto-clean when globals are enabled via config rather than CLI. */
afterEach(cleanup);
