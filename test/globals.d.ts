import type { Option } from "effect";
import type { MobyConnectionOptions } from "../src/index.ts";

declare global {
    var __DIND_VOLUME_ID: Option.Option<string>;
    var __DIND_CONTAINER_ID: Option.Option<string>;
    var __TEST_CONNECTION_OPTIONS: MobyConnectionOptions;
}
