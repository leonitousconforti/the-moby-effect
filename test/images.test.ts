import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer, Stream } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Images tests for $exposeDindContainerBy+$dindBaseImage",
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

        layer(testLayer, { timeout: Duration.minutes(2) })("MobyApi Images tests", (it) => {
            it.effect(
                "Should search for an image (this test could be flaky depending on docker hub availability and transient network conditions)",
                () =>
                    Effect.gen(function* () {
                        const images = yield* MobyEndpoints.Images;
                        const searchResults = yield* images.search({
                            term: "alpine",
                            limit: 1,
                            "is-official": true,
                        });
                        expect(searchResults).toBeInstanceOf(Array);
                        expect(searchResults).toHaveLength(1);
                        expect(searchResults[0]!.name).toBe("alpine");
                        expect(searchResults[0]!.is_official).toBe(true);
                        expect(searchResults[0]!.is_automated).toBe(false);
                        expect(searchResults[0]!.description).toBe(
                            "A minimal Docker image based on Alpine Linux with a complete package index and only 5 MB in size!"
                        );
                    })
            );

            it.effect(
                "Should pull an image",
                () =>
                    Effect.gen(function* () {
                        const images = yield* MobyEndpoints.Images;
                        const pullResponse = images.create({ fromImage: "docker.io/library/alpine:latest" });
                        yield* Stream.runCollect(pullResponse);
                    }),
                30_000
            );

            it.effect("Should inspect an image", () =>
                Effect.gen(function* () {
                    const images = yield* MobyEndpoints.Images;
                    const inspectResponse = yield* images.inspect({ name: "docker.io/library/alpine:latest" });
                    expect(inspectResponse.Id).toBeDefined();
                    expect(inspectResponse.RepoDigests).toBeDefined();
                    expect(inspectResponse.RepoTags).toBeDefined();
                    expect(inspectResponse.Size).toBeDefined();
                })
            );

            it.effect("Should tag an image", () =>
                Effect.gen(function* () {
                    const images = yield* MobyEndpoints.Images;
                    yield* images.tag({
                        name: "docker.io/library/alpine:latest",
                        repo: "docker.io/person/their-image",
                        tag: "test",
                    });
                })
            );

            it.effect("Should get the history of an image", () =>
                Effect.gen(function* () {
                    const images = yield* MobyEndpoints.Images;
                    const historyResponse = yield* images.history({ name: "docker.io/library/alpine:latest" });
                    expect(historyResponse).toBeInstanceOf(Array);
                })
            );

            it.effect("Should prune all images", () =>
                Effect.gen(function* () {
                    const images = yield* MobyEndpoints.Images;
                    const pruneResponse = yield* images.prune();
                    expect(pruneResponse.SpaceReclaimed).toBeDefined();
                })
            );
        });
    }
);
