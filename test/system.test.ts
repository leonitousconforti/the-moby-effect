import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer, Stream } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi System tests for $exposeDindContainerBy+$dindBaseImage",
    ({ dindBaseImage, exposeDindContainerBy }) => {
        const testLayer = MobyConnection.connectionOptionsFromPlatformSystemSocketDefault
            .pipe(
                Effect.map((connectionOptionsToHost) =>
                    makePlatformDindLayer({
                        dindBaseImage,
                        exposeDindContainerBy,
                        connectionOptionsToHost,
                    })
                )
            )
            .pipe(Layer.unwrapEffect)
            .pipe(Layer.provide(NodeContext.layer));

        layer(testLayer, { timeout: Duration.minutes(2) })("MobyApi System tests", (it) => {
            it.effect("Should ping the docker daemon", () =>
                Effect.gen(function* () {
                    const system = yield* MobyEndpoints.Systems;
                    yield* system.ping();
                })
            );

            it.effect("Should see the docker version", () =>
                Effect.gen(function* () {
                    const system = yield* MobyEndpoints.Systems;
                    const versionResponse = yield* system.version();
                    expect(versionResponse).toBeDefined();
                })
            );

            it.effect("Should see the docker info", () =>
                Effect.gen(function* () {
                    const system = yield* MobyEndpoints.Systems;
                    const infoResponse = yield* system.info();
                    expect(infoResponse).toBeDefined();
                })
            );

            it.effect("Should see the docker system data usage", () =>
                Effect.gen(function* () {
                    const system = yield* MobyEndpoints.Systems;
                    const dataUsageResponse = yield* system.dataUsage();
                    expect(dataUsageResponse).toBeDefined();
                })
            );

            it.effect.skip("Should see docker events", () =>
                Effect.gen(function* () {
                    const system = yield* MobyEndpoints.Systems;
                    yield* Stream.runHead(system.events({ since: "0" }));
                })
            );
        });
    }
);
