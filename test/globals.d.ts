import type { MobyConnectionOptions } from "../src/PlatformAgents.ts";

export type PLATFORM_VARIANT =
    | "node-18.x"
    | "node-20.x"
    | "node-22.x"
    | "bun"
    | "deno"
    | "node-18.x-undici"
    | "node-20.x-undici"
    | "node-22.x-undici"
    | "bun-undici"
    | "deno-undici";

export type DOCKER_ENGINE_VERSION =
    | "docker.io/library/docker:23-dind"
    | "docker.io/library/docker:24-dind"
    | "docker.io/library/docker:25-dind"
    | "docker.io/library/docker:26-dind"
    | "docker.io/library/docker:27-dind";

declare module "vitest" {
    export interface ProvidedContext {
        __DOCKER_HOST_CONNECTION_OPTIONS: MobyConnectionOptions;
        __CONNECTION_VARIANT: MobyConnectionOptions["_tag"];
        __PLATFORM_VARIANT: PLATFORM_VARIANT;
        __DOCKER_ENGINE_VERSION: DOCKER_ENGINE_VERSION;
    }
}
