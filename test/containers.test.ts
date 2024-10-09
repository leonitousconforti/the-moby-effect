import { expect, layer } from "@effect/vitest";
import { Effect, Layer, Stream } from "effect";
import * as Convey from "the-moby-effect/Convey";
import * as DockerEngine from "the-moby-effect/DockerEngine";
import { Containers } from "the-moby-effect/endpoints/Containers";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Containers tests", (it) => {
    it.effect.skip(
        "Should create, list, pause, unpause, top, kill, start, restart, stop, rename, changes, prune, and finally force delete a container (this test could be flaky because it pulls the alpine image from docker hub)",
        () =>
            Effect.gen(function* () {
                const containers = yield* Containers;
                const pullStream = DockerEngine.pull({ image: "docker.io/library/alpine:latest" });
                yield* Convey.waitForProgressToComplete(pullStream);

                const { Id: id } = yield* DockerEngine.run({
                    spec: {
                        StopTimeout: 10,
                        Image: "docker.io/library/alpine:latest",
                        Cmd: ["sleep", "1m"],
                    },
                });

                // List containers
                const containerList = yield* containers.list();
                expect(containerList).toBeInstanceOf(Array);

                // Pause and unpause the container
                yield* containers.pause({ id });
                yield* containers.unpause({ id });

                // Top, stats one-shot, and stats stream the container
                yield* containers.top({ id });
                yield* Stream.runCollect(containers.stats({ id, stream: false }));
                const statsStream = containers.stats({ id, stream: true });
                yield* statsStream.pipe(Stream.take(1)).pipe(Stream.runCollect);

                // Update and resize the container
                // yield* containers.update({ id, spec: { Devices: [] } });
                yield* containers.resize({ id, h: 100, w: 100 });

                // Kill, start, restart, and stop the container
                yield* containers.kill({ id });
                yield* containers.start({ id });
                yield* containers.restart({ id });
                yield* containers.stop({ id });

                // Get the FS changes, get details about a path, and get a tarball for a path
                yield* containers.changes({ id });
                yield* containers.archiveInfo({ id, path: "/bin" });
                const archiveStream = containers.archive({ id, path: "/bin" });
                yield* containers.putArchive({ id, path: "/bin", stream: archiveStream });

                // Export the container
                const exportStream = containers.export({ id });
                yield* Stream.runCollect(exportStream);

                // Rename, force delete, and prune the container
                yield* containers.rename({ id, name: "new-name" });
                yield* containers.delete({ id, force: true });
                yield* containers.prune();
            })
    );

    it.effect.skip("Should wait for a container to exit", () =>
        Effect.gen(function* () {
            const containers = yield* Containers;
            const { Id: id } = yield* DockerEngine.run({
                spec: {
                    StopTimeout: 10,
                    Image: "docker.io/library/alpine:latest",
                    Cmd: ["sleep", "1s"],
                },
            });

            yield* containers.wait({ id });
            const logs = containers.logs({ id, follow: false, stdout: true, stderr: true });
            yield* Stream.runCollect(logs);
        })
    );
});
