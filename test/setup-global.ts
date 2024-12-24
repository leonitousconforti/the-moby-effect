import type { GlobalSetupContext } from "vitest/node";

import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
import * as MobyConnection from "the-moby-effect/MobyConnection";

export const setup = async function ({ provide }: GlobalSetupContext): Promise<void> {
    await Effect.gen(function* () {
        const connectionVariant = yield* Config.literal("socket", "http", "https", "ssh")("__CONNECTION_VARIANT");

        const platformVariant = yield* Config.literal(
            "deno",
            "bun",
            "node-18.x",
            "node-20.x",
            "node-22.x",
            "bun-undici",
            "deno-undici",
            "node-20.x-undici",
            "node-22.x-undici"
        )("__PLATFORM_VARIANT");

        const dockerEngineVersion = yield* Config.literal(
            "docker.io/library/docker:dind-rootless",
            "docker.io/library/docker:23-dind-rootless",
            "docker.io/library/docker:24-dind-rootless",
            "docker.io/library/docker:25-dind-rootless",
            "docker.io/library/docker:26-dind-rootless",
            "docker.io/library/docker:27-dind-rootless"
        )("__DOCKER_ENGINE_VERSION");

        const connectionOptions: MobyConnection.MobyConnectionOptions = yield* Function.pipe(
            Config.string("__DOCKER_HOST_CONNECTION_OPTIONS"),
            Config.option,
            Config.map(Option.map(MobyConnection.connectionOptionsFromUrl)),
            Config.map(Option.getOrElse(() => MobyConnection.connectionOptionsFromPlatformSystemSocketDefault)),
            Effect.flatten
        );

        provide("__PLATFORM_VARIANT", platformVariant);
        provide("__CONNECTION_VARIANT", connectionVariant);
        provide("__DOCKER_ENGINE_VERSION", dockerEngineVersion);
        provide("__DOCKER_HOST_CONNECTION_OPTIONS", connectionOptions);
    }).pipe(Effect.runPromise);
};
