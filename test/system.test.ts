import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Duration, Effect, Either, Layer, Option, Schema, Stream } from "effect";
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

                        const schema = Schema.transform(
                            Schema.Union(
                                Schema.Literal("docker.io/library/docker:dind-rootless"),
                                Schema.TemplateLiteral("docker.io/library/docker:", Schema.String, "-dind-rootless")
                            ),
                            Schema.EitherFromSelf({
                                right: Schema.NumberFromString,
                                left: Schema.Literal("latest"),
                            }),
                            {
                                decode: (str) =>
                                    str === "docker.io/library/docker:dind-rootless"
                                        ? Either.left("latest" as const)
                                        : Either.right(str.split(":")[1].replace("-dind-rootless", "")),
                                encode: (version) =>
                                    Either.match(version, {
                                        onLeft: () => `docker.io/library/docker:dind-rootless` as const,
                                        onRight: (v) => `docker.io/library/docker:${v}-dind-rootless` as const,
                                    }),
                            }
                        );

                        const runningMajorVersion = yield* Schema.decode(schema)(dindBaseImage);
                        if (Either.isRight(runningMajorVersion)) {
                            expect(versionResponse.Version).toContain(runningMajorVersion.right);
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
                            .pipe(Stream.take(1))
                            .pipe(Stream.runHead)
                            .pipe(Effect.fork);

                        // Create an event
                        yield* Effect.sleep("1 second");
                        const volumes = yield* MobyEndpoints.Volumes;
                        yield* volumes.create({ Name: "events-test-volume-2" });

                        // Gather the event
                        const data = yield* fiber;
                        expect(Option.getOrUndefined(data)).toBeDefined();
                    })
                );
            });
        });
    }
);
