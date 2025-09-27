import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer, Schema, Stream } from "effect";
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
                        Schema.String,
                        {
                            decode: (str) =>
                                str === "docker.io/library/docker:dind-rootless"
                                    ? "latest"
                                    : str.split(":")[1]!.split("-dind-rootless")[0]!,
                            encode: (version) =>
                                version === "latest"
                                    ? ("docker.io/library/docker:dind-rootless" as const)
                                    : (`docker.io/library/docker:${version}-dind-rootless` as const),
                        }
                    );

                    const runningMajorVersion = yield* Schema.decode(schema)(dindBaseImage);
                    if (runningMajorVersion !== "latest") {
                        expect(versionResponse.Version).toContain(runningMajorVersion);
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

            it.effect("Should see docker events", () =>
                Effect.gen(function* () {
                    const system = yield* MobyEndpoints.System;
                    yield* Stream.runHead(system.events({ since: "0" }));
                })
            );
        });
    }
);
