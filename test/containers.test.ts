import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer, Stream } from "effect";
import { I64 } from "effect-schemas/Number";
import { DockerEngine, MobyConnection, MobyConvey, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Containers tests for $exposeDindContainerBy+$dindBaseImage",
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

        layer(testLayer, { timeout: Duration.minutes(2) })((it) => {
            it.effect(
                "Should create, list, pause, unpause, top, stats, resize, kill, start, restart, stop, rename, changes, prune, and finally force delete a container (this test could be flaky because it pulls the alpine image from docker hub)",
                () =>
                    Effect.gen(function* () {
                        const containers = yield* MobyEndpoints.Containers;
                        const pullStream = DockerEngine.pull({ image: "docker.io/library/ubuntu:latest" });
                        yield* MobyConvey.waitForProgressToComplete(pullStream);

                        const { Id: id } = yield* DockerEngine.run({
                            StopTimeout: I64.make(10n),
                            Image: "docker.io/library/ubuntu:latest",
                            Cmd: ["sleep", "1m"],
                        });

                        // List containers
                        const containerList = yield* containers.list();
                        expect(containerList).toBeInstanceOf(Array);

                        // Pause and unpause the container
                        yield* containers.pause(id);
                        yield* containers.unpause(id);

                        // Top, stats one-shot, and stats stream the container
                        yield* containers.top(id);
                        yield* Stream.runCollect(containers.stats(id, { stream: false }));
                        const statsStream = containers.stats(id, { stream: true });
                        yield* statsStream.pipe(Stream.take(1)).pipe(Stream.runCollect);

                        // Update and resize the container
                        // yield* containers.update({ id, spec: { Devices: [] } });
                        yield* containers.resize(id, { h: 100, w: 100 });

                        // Kill, start, restart, and stop the container
                        yield* containers.kill(id);
                        yield* containers.start(id);
                        yield* containers.restart(id);
                        yield* containers.stop(id);

                        // Get the FS changes, get details about a path, and get a tarball for a path
                        yield* containers.changes(id);
                        yield* containers.archiveInfo(id, { path: "/bin" });
                        // const archiveStream = containers.archive(id, { path: "/bin" });
                        // yield* containers.putArchive(id, archiveStream, { path: "/bin" });

                        // Export the container
                        const exportStream = containers.export(id);
                        yield* Stream.runCollect(exportStream);

                        // Rename, force delete, and prune the container
                        yield* containers.rename(id, "new-name");
                        yield* containers.delete(id, { force: true });
                        yield* containers.prune();
                    }),
                {
                    timeout: Duration.minutes(3).pipe(Duration.toMillis),
                }
            );

            it("Should wait for a container to exit and get its logs", () =>
                Effect.gen(function* () {
                    const containers = yield* MobyEndpoints.Containers;
                    const { Id: id } = yield* DockerEngine.run({
                        StopTimeout: I64.make(10n),
                        Image: "docker.io/library/ubuntu:latest",
                        Cmd: ["sleep", "1s"],
                    });

                    yield* containers.wait(id);
                    const logs = containers.logs(id, { follow: false, stdout: true, stderr: true });
                    yield* Stream.runCollect(logs);
                }));
        });
    }
);
