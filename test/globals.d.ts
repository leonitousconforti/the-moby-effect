import type { MobyConnectionOptions } from "../src/PlatformAgents.ts";
import type { RecommendedDindBaseImages } from "../src/blobs/Constants.ts";

export type PLATFORM_VARIANT =
    | "node-18.x"
    | "node-20.x"
    | "node-22.x"
    | "bun"
    | "deno"
    | "node-20.x-undici"
    | "node-22.x-undici"
    | "bun-undici"
    | "deno-undici";

declare module "vitest" {
    export interface ProvidedContext {
        __PLATFORM_VARIANT: PLATFORM_VARIANT;
        __DOCKER_ENGINE_VERSION: RecommendedDindBaseImages;
        __CONNECTION_VARIANT: MobyConnectionOptions["_tag"];
        __DOCKER_HOST_CONNECTION_OPTIONS: MobyConnectionOptions;
    }
}
