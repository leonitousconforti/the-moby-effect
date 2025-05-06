import type { TestProject } from "vitest/node";

import * as Array from "effect/Array";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";

import { DockerEngine, MobyConnection, MobyConvey } from "the-moby-effect";
import { testMatrix } from "./shared.js";

const localDocker = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect
);

export const setup = async function ({ provide }: TestProject): Promise<void> {
    await Effect.gen(function* () {
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
        )("__PLATFORM_VARIANT").pipe(Config.orElse(() => Config.succeed("node-18.x" as const)));

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
    })
        .pipe(Effect.provide(localDocker))
        .pipe(Effect.runPromise);
};
