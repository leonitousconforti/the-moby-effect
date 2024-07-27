import type { MobyConnectionOptions } from "../src/PlatformAgents.ts";

declare module "vitest" {
    export interface ProvidedContext {
        __DOCKER_HOST_CONNECTION_OPTIONS: MobyConnectionOptions;
        __CONNECTION_VARIANT: MobyConnectionOptions["_tag"];
        __PLATFORM_VARIANT: "node" | "deno" | "bun" | "node-undici" | "deno-undici" | "bun-undici";
        __DOCKER_ENGINE_VERSION:
            | "docker.io/library/docker:dind"
            | "docker.io/library/docker:20-dind"
            | "docker.io/library/docker:23-dind"
            | "docker.io/library/docker:24-dind"
            | "docker.io/library/docker:25-dind"
            | "docker.io/library/docker:26-dind";
    }
}
