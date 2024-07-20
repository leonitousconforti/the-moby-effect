import { describe, inject, it } from "@effect/vitest";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";
import * as MobyAgent from "the-moby-effect/Agent";
import * as Moby from "the-moby-effect/Moby";
import * as Images from "the-moby-effect/endpoints/Images";

describe("MobyApi Containers tests", () => {
    const testImagesService: Layer.Layer<Images.Images, never, never> = Moby.layer
        .pipe(Layer.provide(MobyAgent.makeNodeHttpClientLayer(inject("__TEST_CONNECTION_OPTIONS"))))
        .pipe(Layer.orDie);

    const testContainersService: Layer.Layer<Containers.Containers, never, never> = Moby.layer.pipe().pipe(Layer.orDie);

    it("Should create, list, pause, unpause, top, kill, start, restart, stop, rename, changes, prune, and finally force delete a container (this test could be flaky because it pulls the alpine image from docker hub)", async () => {
        await Effect.gen(function* () {
            const containers: MobyApi.Containers.Containers = yield* MobyApi.Containers.Containers;

            // Download the image from docker hub if necessary, create the container, start it, wait for it to be running
            const { Id: containerId } = yield* MobyApi.DockerCommon.run({
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
            });

            const id: string = containerId!;
            yield* containers.list();

            // Pause and unpause the container
            yield* containers.pause({ id });
            yield* containers.unpause({ id });

            // Top, stats one-shot, and stats stream the container
            yield* containers.top({ id });
            yield* containers.stats({ id, stream: false });
            const statsStream = yield* containers.stats({ id, stream: true });
            yield* statsStream.pipe(Stream.take(1)).pipe(Stream.runCollect);

            // Update and resize the container
            yield* containers.update({ id, spec: { Devices: [] } });
            yield* containers.resize({ id, h: 100, w: 100 });

            // Kill, start, restart, and stop the container
            yield* containers.kill({ id });
            yield* containers.start({ id });
            yield* containers.restart({ id });
            yield* containers.stop({ id });

            // Get the FS changes, get details about a path, and get a tarball for a path
            yield* containers.changes({ id });
            yield* containers.archiveInfo({ id, path: "/bin" });
            const archiveStream: Stream.Stream<Uint8Array, MobyApi.Containers.ContainersError, never> =
                yield* containers.archive({ id, path: "/bin" });
            yield* containers.putArchive({ id, path: "/bin", stream: archiveStream });

            // Export the container
            const exportStream = yield* containers.export({ id });
            yield* Stream.runCollect(exportStream);

            // Rename, force delete, and prune the container
            yield* containers.rename({ id, name: "new-name" });
            yield* containers.delete({ id, force: true });
            yield* containers.prune();
        })
            .pipe(Effect.provide(testImagesService))
            .pipe(Effect.provide(testContainersService))
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);
    }, 60_000);

    it("Should wait for a container to exit", async () => {
        await Effect.gen(function* () {
            const containers: MobyApi.Containers.Containers = yield* MobyApi.Containers.Containers;

            const { Id: containerId } = yield* MobyApi.DockerCommon.run({
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
            });

            yield* containers.wait({ id: containerId! });
            yield* containers.logs({ id: containerId!, follow: false, stdout: true, stderr: true });
        })
            .pipe(Effect.provide(testImagesService))
            .pipe(Effect.provide(testContainersService))
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);
    }, 10_000);
});
