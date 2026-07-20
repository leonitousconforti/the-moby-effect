import { Duration, Effect, Fiber, Layer, Option, Result, Schema, SchemaGetter, Stream } from "effect";

import { NodeServices } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";

import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi System tests for $exposeDindContainerBy+$dindBaseImage",
    ({ dindBaseImage, exposeDindContainerBy }) => {
        const testLayer = MobyConnection.connectionOptionsFromPlatformSystemSocketDefault.pipe(
            Effect.map((connectionOptionsToHost) =>
                makePlatformDindLayer({
                    dindBaseImage,
                    exposeDindContainerBy,
                    connectionOptionsToHost,
                })
            ),
            Layer.unwrap,
            Layer.provide(NodeServices.layer)
        );

        layer(testLayer, {
            timeout: Duration.minutes(2),
            excludeTestServices: true,
        })((it) => {
            describe.sequential("MobyApi System tests", () => {
                it.effect("Should ping the docker daemon", () =>
                    Effect.gen(function* () {
                        const system = yield* MobyEndpoints.System;
                        yield* system.ping();
                    })
                );

                it.effect("Should see the docker version", () =>
                    Effect.gen(function* () {
                        const system = yield* MobyEndpoints.System;
                        const versionResponse = yield* system.version();
                        expect(versionResponse).toBeDefined();

                        const schema = Schema.Union([
                            Schema.Literal("docker.io/library/docker:dind-rootless"),
                            Schema.TemplateLiteral(["docker.io/library/docker:", Schema.String, "-dind-rootless"]),
                        ]).pipe(
                            Schema.decodeTo(Schema.Result(Schema.NumberFromString, Schema.Literal("latest")), {
                                decode: SchemaGetter.transform((str) =>
                                    str === "docker.io/library/docker:dind-rootless"
                                        ? Result.fail("latest" as const)
                                        : Result.succeed(str.split(":")[1]!.replace("-dind-rootless", ""))
                                ),
                                encode: SchemaGetter.transform((version) =>
                                    Result.match(version, {
                                        onFailure: () => `docker.io/library/docker:dind-rootless` as const,
                                        onSuccess: (v) => `docker.io/library/docker:${v}-dind-rootless` as const,
                                    })
                                ),
                            })
                        );

                        const runningMajorVersion = yield* Schema.decodeEffect(schema)(dindBaseImage);
                        if (Result.isSuccess(runningMajorVersion)) {
                            expect(versionResponse.Version).toContain(runningMajorVersion.success);
                        }
                    })
                );

                it.effect("Should see the docker info", () =>
                    Effect.gen(function* () {
                        const system = yield* MobyEndpoints.System;
                        const infoResponse = yield* system.info();
                        expect(infoResponse).toBeDefined();
                    })
                );

                it.effect("Should see the docker system data usage", () =>
                    Effect.gen(function* () {
                        const system = yield* MobyEndpoints.System;
                        const dataUsageResponse = yield* system.dataUsage();
                        expect(dataUsageResponse).toBeDefined();
                    })
                );

                it.effect("Should see docker events until now", () =>
                    Effect.gen(function* () {
                        // Create an event
                        const volumes = yield* MobyEndpoints.Volumes;
                        yield* volumes.create({ Name: "events-test-volume-1" });
                        yield* Effect.sleep("1 second");

                        // Gather the event
                        const system = yield* MobyEndpoints.System;
                        const stream = system.events({ until: `${Date.now()}` }).pipe(Stream.take(1));
                        const data = yield* Stream.runHead(stream);
                        expect(Option.getOrUndefined(data)).toBeDefined();
                    })
                );

                it.effect("Should see docker events after now", () =>
                    Effect.gen(function* () {
                        const system = yield* MobyEndpoints.System;
                        const fiber = yield* system
                            .events({ since: `${Date.now()}` })
                            .pipe(Stream.take(1), Stream.runHead, Effect.forkChild);

                        // Create an event
                        yield* Effect.sleep("1 second");
                        const volumes = yield* MobyEndpoints.Volumes;
                        yield* volumes.create({ Name: "events-test-volume-2" });

                        // Gather the event
                        const data = yield* Fiber.join(fiber);
                        expect(Option.getOrUndefined(data)).toBeDefined();
                    })
                );
            });
        });
    }
);
