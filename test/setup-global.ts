import * as Array from "effect/Array";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";

import type { TestProject } from "vitest/node";

import { DockerEngine, MobyConnection, MobyConvey } from "the-moby-effect";

import { testMatrix } from "./shared-global.js";

const makePlatformDockerLayer = Function.pipe(
    Match.value(process.env["__PLATFORM_VARIANT"] ?? "node-24.x"),
    Match.when("bun", () => DockerEngine.layerBun),
    Match.when("deno", () => DockerEngine.layerDeno),
    Match.whenOr("node-22.x", "node-24.x", "node-26.x", () => DockerEngine.layerNodeJS),
    Match.orElse(() => DockerEngine.layerUndici)
);

const localDocker = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map(makePlatformDockerLayer),
    Layer.unwrap
);

export const setup = async function ({ provide }: TestProject): Promise<void> {
    await Effect.gen(function* () {
        const platformVariant = yield* Config.literals(
            [
                "bun",
                "bun-undici",
                "deno",
                "deno-undici",
                "node-22.x",
                "node-24.x",
                "node-26.x",
                "node-22.x-undici",
                "node-24.x-undici",
                "node-26.x-undici",
            ],
            "__PLATFORM_VARIANT"
        ).pipe(Config.withDefault("node-24.x" as const));

        provide("__PLATFORM_VARIANT", platformVariant);

        const images = Function.pipe(
            testMatrix,
            Array.map(({ dindBaseImage }) => dindBaseImage),
            Array.dedupe
        );

        for (const image of images) {
            const pullStream = DockerEngine.pull({ image });
            yield* MobyConvey.waitForProgressToComplete(pullStream);
        }
    }).pipe(Effect.provide(localDocker), Effect.runPromise);
};
