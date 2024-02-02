import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";

import * as MobyApi from "../../src/index.js";
import { AfterAll, BeforeAll, testEngines } from "./helpers.js";

let dindContainerId: string = undefined!;
let dindStorageVolumeName: string = undefined!;
let testImagesService: Layer.Layer<never, never, MobyApi.Images.Images> = undefined!;

describe.each(testEngines)("MobyApi Images tests", (image) => {
    afterAll(async () => await AfterAll(dindContainerId, dindStorageVolumeName), 30_000);
    beforeAll(async () => {
        [dindContainerId, dindStorageVolumeName, testImagesService] = await BeforeAll(
            image,
            MobyApi.Images.fromConnectionOptions
        );
    }, 30_000);

    it("Should see no images", async () => {
        const images: Readonly<MobyApi.Schemas.ImageSummary[]> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Images.Images, (images) => images.list({ all: true })),
                testImagesService
            )
        );
        expect(images).toHaveLength(0);
    });

    it("Should search for an image (this test could be flaky depending on docker hub availability and transient network conditions)", async () => {
        const searchResults = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Images.Images, (images) =>
                    images.search({
                        term: "alpine",
                        limit: 1,
                        filters: JSON.stringify({ "is-official": ["true"] }),
                    })
                ),
                testImagesService
            )
        );
        expect(searchResults).toBeInstanceOf(Array);
        expect(searchResults).toHaveLength(1);
        expect(searchResults[0]!.name).toBe("alpine");
        expect(searchResults[0]!.is_official).toBe(true);
        expect(searchResults[0]!.is_automated).toBe(false);
        expect(searchResults[0]!.description).toBe(
            "A minimal Docker image based on Alpine Linux with a complete package index and only 5 MB in size!"
        );
    });

    it("Should pull an image", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {
            const images: MobyApi.Images.Images = yield* _(MobyApi.Images.Images);

            const pullResponse: Stream.Stream<never, MobyApi.Images.ImagesError, MobyApi.Schemas.BuildInfo> = yield* _(
                images.create({
                    fromImage: "docker.io/library/alpine:latest",
                })
            );

            yield* _(Stream.runCollect(pullResponse));
        })
            .pipe(Effect.provide(testImagesService))
            .pipe(Effect.runPromise);
    }, 30_000);

    it("Should inspect an image", async () => {
        const inspectResponse: Readonly<MobyApi.Schemas.ImageInspect> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Images.Images, (images) =>
                    images.inspect({ name: "docker.io/library/alpine:latest" })
                ),
                testImagesService
            )
        );
        expect(inspectResponse.Id).toBeDefined();
        expect(inspectResponse.RepoDigests).toBeDefined();
        expect(inspectResponse.RepoTags).toBeDefined();
        expect(inspectResponse.Size).toBeDefined();
    });

    it("Should tag an image", async () => {
        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Images.Images, (images) =>
                    images.tag({
                        name: "docker.io/library/alpine:latest",
                        repo: "docker.io/person/their-image",
                        tag: "test",
                    })
                ),
                testImagesService
            )
        );
    });

    it("Should get the history of an image", async () => {
        const historyResponse = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Images.Images, (images) =>
                    images.history({ name: "docker.io/library/alpine:latest" })
                ),
                testImagesService
            )
        );
        expect(historyResponse).toBeInstanceOf(Array);
    });

    it("Should prune all images", async () => {
        const pruneResponse: Readonly<MobyApi.Schemas.ImagePruneResponse> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Images.Images, (images) => images.prune({ filters: { dangling: ["true"] } })),
                testImagesService
            )
        );
        expect(pruneResponse.ImagesDeleted).toBeDefined();
        expect(pruneResponse.SpaceReclaimed).toBeDefined();
    });
});
