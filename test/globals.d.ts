import type { Option } from "effect";
import type { MobyConnectionOptions } from "../src/index.ts";

declare module "vitest" {
    export interface ProvidedContext {
        __DIND_VOLUME_ID: Option.Option<string>;
        __DIND_CONTAINER_ID: Option.Option<string>;
        __TEST_CONNECTION_OPTIONS: MobyConnectionOptions;
    }
}
