import { afterAll, describe, inject, it } from "@effect/vitest";

import * as Path from "@effect/platform/Path";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Match from "effect/Match";
import * as Stream from "effect/Stream";

import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as Containers from "the-moby-effect/endpoints/Containers";
import * as DindEngine from "the-moby-effect/engines/Dind";

describe("MobyApi Containers tests", () => {
    const makePlatformDindLayer = Function.pipe(
        Match.value(inject("__PLATFORM_VARIANT")),
        Match.when("bun", () => DindEngine.layerBun),
        Match.when("deno", () => DindEngine.layerDeno),
        Match.when("node", () => DindEngine.layerNodeJS),
        Match.whenOr("node-undici", "deno-undici", "bun-undici", () => DindEngine.layerUndici),
        Match.exhaustive
    );

    const testServices: DindEngine.DindLayer = makePlatformDindLayer({
        exposeDindContainerBy: inject("__CONNECTION_VARIANT"),
        connectionOptionsToHost: inject("__DOCKER_HOST_CONNECTION_OPTIONS"),
    });

    const testRuntime = ManagedRuntime.make(Layer.provide(testServices, Path.layer));
    afterAll(() => testRuntime.dispose().then(() => {}));

    it("Should create, list, pause, unpause, top, kill, start, restart, stop, rename, changes, prune, and finally force delete a container (this test could be flaky because it pulls the alpine image from docker hub)", async () => {
        await Effect.gen(function* () {
            // Download the image from docker hub if necessary, create the container, start it, wait for it to be running
            const { Id: containerId } = yield* DockerEngine.run({
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
            yield* Containers.Containers.list();

            // Pause and unpause the container
            yield* Containers.Containers.pause({ id });
            yield* Containers.Containers.unpause({ id });

            // Top, stats one-shot, and stats stream the container
            yield* Containers.Containers.top({ id });
            yield* Containers.Containers.stats({ id, stream: false });
            const statsStream = yield* Containers.Containers.stats({ id, stream: true });
            yield* statsStream.pipe(Stream.take(1)).pipe(Stream.runCollect);

            // Update and resize the container
            yield* Containers.Containers.update({ id, spec: { Devices: [] } });
            yield* Containers.Containers.resize({ id, h: 100, w: 100 });

            // Kill, start, restart, and stop the container
            yield* Containers.Containers.kill({ id });
            yield* Containers.Containers.start({ id });
            yield* Containers.Containers.restart({ id });
            yield* Containers.Containers.stop({ id });

            // Get the FS changes, get details about a path, and get a tarball for a path
            yield* Containers.Containers.changes({ id });
            yield* Containers.Containers.archiveInfo({ id, path: "/bin" });
            const archiveStream = yield* Containers.Containers.archive({ id, path: "/bin" });
            yield* Containers.Containers.putArchive({ id, path: "/bin", stream: archiveStream });

            // Export the container
            const exportStream = yield* Containers.Containers.export({ id });
            yield* Stream.runCollect(exportStream);

            // Rename, force delete, and prune the container
            yield* Containers.Containers.rename({ id, name: "new-name" });
            yield* Containers.Containers.delete({ id, force: true });
            yield* Containers.Containers.prune();
        }).pipe(testRuntime.runPromise);
    }, 60_000);

    it("Should wait for a container to exit", async () => {
        await Effect.gen(function* () {
            const { Id: containerId } = yield* DockerEngine.run({
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

            yield* Containers.Containers.wait({ id: containerId! });
            yield* Containers.Containers.logs({ id: containerId!, follow: false, stdout: true, stderr: true });
        }).pipe(testRuntime.runPromise);
    }, 10_000);
});
