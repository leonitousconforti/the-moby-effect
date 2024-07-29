import type { GlobalSetupContext } from "vitest/node";

import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
import * as PlatformAgents from "the-moby-effect/PlatformAgents";

export const setup = async function ({ provide }: GlobalSetupContext): Promise<void> {
    await Effect.gen(function* () {
        const connectionVariant = yield* Config.literal("socket", "http", "https", "ssh")("__CONNECTION_VARIANT");

        const platformVariant = yield* Config.literal(
            "node",
            "deno",
            "bun",
            "node-undici",
            "deno-undici",
            "bun-undici"
        )("__PLATFORM_VARIANT");

        const dockerEngineVersion = yield* Config.literal(
            "docker.io/library/docker:dind",
            "docker.io/library/docker:19-dind",
            "docker.io/library/docker:20-dind",
            "docker.io/library/docker:23-dind",
            "docker.io/library/docker:24-dind",
            "docker.io/library/docker:25-dind",
            "docker.io/library/docker:26-dind",
            "docker.io/library/docker:27-dind"
        )("__DOCKER_ENGINE_VERSION");

        const connectionOptions: PlatformAgents.MobyConnectionOptions = yield* Function.pipe(
            Config.string("__DOCKER_HOST_CONNECTION_OPTIONS"),
            Config.option,
            Config.map(Option.map(PlatformAgents.connectionOptionsFromUrl)),
            Config.map(Option.getOrElse(PlatformAgents.connectionOptionsFromPlatformSystemSocketDefault)),
            Effect.flatten
        );

        provide("__PLATFORM_VARIANT", platformVariant);
        provide("__CONNECTION_VARIANT", connectionVariant);
        provide("__DOCKER_ENGINE_VERSION", dockerEngineVersion);
        provide("__DOCKER_HOST_CONNECTION_OPTIONS", connectionOptions);
    }).pipe(Effect.runPromise);
};
