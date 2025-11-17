import { FileSystem, Path } from "@effect/platform";
import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Context, Duration, Effect, Layer, Sink, Stream } from "effect";
import { DockerEngine, MobyConnection, MobyConvey, MobyDemux, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Execs tests for $exposeDindContainerBy+$dindBaseImage",
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
            .pipe(
                Layer.tap((context) =>
                    Effect.gen(function* () {
                        const path = yield* Path.Path;
                        const fileSystem = yield* FileSystem.FileSystem;
                        const images = Context.get(context, MobyEndpoints.Images);

                        const fixture1 = yield* path.fromFileUrl(
                            new URL("fixtures/alpine_latest.tar", import.meta.url)
                        );
                        const fixture2 = yield* path.fromFileUrl(
                            new URL("fixtures/ubuntu_latest.tar", import.meta.url)
                        );

                        const alpineTarBuffer = fileSystem.stream(fixture1);
                        const pullStream = images.import(alpineTarBuffer);
                        yield* MobyConvey.waitForProgressToComplete(pullStream);

                        const ubuntuTarBuffer = fileSystem.stream(fixture2);
                        const pullStream2 = images.import(ubuntuTarBuffer);
                        yield* MobyConvey.waitForProgressToComplete(pullStream2);
                    })
                )
            )
            .pipe(Layer.provide(NodeContext.layer));

        layer(testLayer, { timeout: Duration.minutes(2) })("MobyApi Execs tests", (it) => {
            it.scoped("exec", () =>
                Effect.gen(function* () {
                    const { Id: id } = yield* DockerEngine.runScoped({
                        Image: "docker.io/library/alpine:latest",
                        Cmd: ["sleep", "1m"],
                    });

                    const [exitCode, output] = yield* DockerEngine.exec({
                        containerId: id,
                        command: ["echo", "hello world"],
                    });

                    expect(exitCode).toBe(0n);
                    expect(output).toBe("hello world\n");
                })
            );

            it.scoped("execWebsocketsNonBlocking", () =>
                Effect.gen(function* () {
                    // FIXME: websockets non blocking is broken on docker:26-dind-rootless
                    if (dindBaseImage === "docker.io/library/docker:26-dind-rootless") return;

                    const { Id: id } = yield* DockerEngine.runScoped({
                        OpenStdin: true,
                        AttachStdin: true,
                        AttachStdout: true,
                        AttachStderr: true,
                        Entrypoint: ["/bin/bash"],
                        Image: "docker.io/library/ubuntu:latest",
                    });

                    const multiplexed = yield* DockerEngine.execWebsocketsNonBlocking({
                        containerId: id,
                        command: ["read", "-p", '">"', "ah", "&&", "echo", "$ah"],
                    });

                    const fanned = yield* MobyDemux.fan(multiplexed, { requestedCapacity: 16 });
                    const packed = yield* MobyDemux.pack(fanned, { requestedCapacity: 16 });

                    const [stdout, stderr] = yield* MobyDemux.demuxMultiplexedToSeparateSinks(
                        packed,
                        Stream.make("ah2\n"),
                        Sink.mkString,
                        Sink.mkString
                    );

                    expect(stderr).toBe("");
                    expect(stdout).toBe("ah2\n");
                })
            );
        });
    }
);
