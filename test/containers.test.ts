import { Effect, Layer, Stream } from "effect";

import * as MobyApi from "../src/index.js";
import { AfterAll, BeforeAll } from "./helpers.js";

let dindContainerId: string = undefined!;
let dindConnectionOptions: MobyApi.MobyConnectionOptions = undefined!;
let testImagesService: Layer.Layer<never, never, MobyApi.Images.Images> = undefined!;
let testContainersService: Layer.Layer<never, never, MobyApi.Containers.Containers> = undefined!;

describe.each(["20-dind", "23-dind", "24-dind", "25-rc-dind", "dind"])("MobyApi Containers tests", (dindTag) => {
    afterAll(async () => await AfterAll(dindContainerId), 30_000);
    beforeAll(async () => {
        [dindContainerId, testContainersService, dindConnectionOptions] = await BeforeAll(
            dindTag,
            MobyApi.Containers.fromConnectionOptions
        );
        testImagesService = MobyApi.Images.fromConnectionOptions(dindConnectionOptions);
    }, 30_000);

    it("Should create, list, pause, unpause, top, kill, start, restart, stop, rename, changes, prune, and finally force delete a container (this test could be flaky because it pulls the alpine image from docker hub)", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {
            const containers: MobyApi.Containers.Containers = yield* _(MobyApi.Containers.Containers);

            // Download the image from docker hub if necessary, create the container, start it, wait for it to be running
            const { Id: containerId } = yield* _(
                MobyApi.run({
                    imageOptions: { kind: "pull", fromImage: "docker.io/library/alpine:latest" },
                    containerOptions: {
                        spec: {
                            AttachStderr: false,
                            AttachStdout: false,
                            StopTimeout: 10,
                            Image: "docker.io/library/alpine:latest",
                            Cmd: ["sleep", "1m"],
                        },
                    },
                })
            );

            const id: string = containerId!;
            yield* _(containers.list());

            // Pause and unpause the container
            yield* _(containers.pause({ id }));
            yield* _(containers.unpause({ id }));

            // Top, stats one-shot, and stats stream the container
            yield* _(containers.top({ id }));
            yield* _(containers.stats({ id, stream: false }));
            const statsStream = yield* _(containers.stats({ id, stream: true }));
            yield* _(statsStream.pipe(Stream.take(1)).pipe(Stream.runCollect));

            // Update and resize the container
            yield* _(containers.update({ id, spec: { Devices: [] } }));
            yield* _(containers.resize({ id, h: 100, w: 100 }));

            // Kill, start, restart, and stop the container
            yield* _(containers.kill({ id }));
            yield* _(containers.start({ id }));
            yield* _(containers.restart({ id }));
            yield* _(containers.stop({ id }));

            // Get the FS changes, get details about a path, and get a tarball for a path
            yield* _(containers.changes({ id }));
            yield* _(containers.archiveInfo({ id, path: "/bin" }));
            const archiveStream: Stream.Stream<never, MobyApi.Containers.ContainersError, Uint8Array> = yield* _(
                containers.archive({ id, path: "/bin" })
            );
            yield* _(containers.putArchive({ id, path: "/bin", stream: Stream.orDie(archiveStream) }));

            // Export the container
            const exportStream = yield* _(containers.export({ id }));
            yield* _(Stream.runCollect(exportStream));

            // Rename, force delete, and prune the container
            yield* _(containers.rename({ id, name: "new-name" }));
            yield* _(containers.delete({ id, force: true }));
            yield* _(containers.prune());
        })
            .pipe(Effect.provide(testImagesService))
            .pipe(Effect.provide(testContainersService))
            .pipe(Effect.runPromise);
    }, 60_000);

    it("Should wait for a container to exit", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {
            const containers: MobyApi.Containers.Containers = yield* _(MobyApi.Containers.Containers);

            const { Id: containerId } = yield* _(
                MobyApi.run({
                    imageOptions: { kind: "pull", fromImage: "docker.io/library/alpine:latest" },
                    containerOptions: {
                        spec: {
                            AttachStderr: false,
                            AttachStdout: false,
                            StopTimeout: 10,
                            Image: "docker.io/library/alpine:latest",
                            Cmd: ["sleep", "1s"],
                        },
                    },
                })
            );

            yield* _(containers.wait({ id: containerId! }));
            yield* _(containers.logs({ id: containerId!, follow: false, stdout: true, stderr: true }));
        })
            .pipe(Effect.provide(testImagesService))
            .pipe(Effect.provide(testContainersService))
            .pipe(Effect.runPromise);
    }, 10_000);
});
