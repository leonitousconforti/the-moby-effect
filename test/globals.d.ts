import type { MobyConnectionOptions } from "../src/index.ts";

declare module "vitest" {
    export interface ProvidedContext {
        __TEST_CONNECTION_OPTIONS: MobyConnectionOptions;
    }
}
