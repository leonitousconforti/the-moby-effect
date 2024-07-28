import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Config from "effect/Config";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Option from "effect/Option";

import * as PlatformAgents from "the-moby-effect/PlatformAgents";
import * as System from "the-moby-effect/endpoints/System";
import * as DindEngine from "the-moby-effect/engines/Dind";

Effect.gen(function* () {
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
        "docker.io/library/docker:20-dind",
        "docker.io/library/docker:23-dind",
        "docker.io/library/docker:24-dind",
        "docker.io/library/docker:25-dind",
        "docker.io/library/docker:26-dind"
    )("__DOCKER_ENGINE_VERSION");

    const connectionOptions = yield* Function.pipe(
        Config.string("__DOCKER_HOST_CONNECTION_OPTIONS"),
        Config.option,
        Config.map(Option.map(PlatformAgents.connectionOptionsFromUrl)),
        Config.map(Option.getOrElse(PlatformAgents.connectionOptionsFromPlatformSystemSocketDefault)),
        Effect.flatten
    );

    yield* Console.log(`Platform Variant: ${platformVariant}`);
    yield* Console.log(`Connection Variant: ${connectionVariant}`);
    yield* Console.log(`Docker Engine Version: ${dockerEngineVersion}`);
    yield* Console.log(`Connection Options: ${JSON.stringify(connectionOptions)}`);

    const dindLayer = DindEngine.layerNodeJS({
        exposeDindContainerBy: connectionVariant,
        connectionOptionsToHost: connectionOptions,
    });

    const response = yield* Effect.provide(System.Systems.ping(), dindLayer);
    yield* Effect.log(response);
})
    .pipe(Effect.provide(NodeContext.layer))
    .pipe(NodeRuntime.runMain);
