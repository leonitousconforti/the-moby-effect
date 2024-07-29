import type { MobyConnectionOptions } from "../src/PlatformAgents.ts";

export type PLATFORM_VARIANT = "node" | "deno" | "bun" | "node-undici" | "deno-undici" | "bun-undici";
export type DOCKER_ENGINE_VERSION =
    | "docker.io/library/docker:dind"
    | "docker.io/library/docker:19-dind"
    | "docker.io/library/docker:20-dind"
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
