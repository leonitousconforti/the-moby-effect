import { Context, Duration, Effect, FileSystem, Layer, Path, Sink, Stream } from "effect";

import { NodeServices } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { DindEngine, DockerEngine, MobyConnection, MobyConvey, MobyDemux, MobyEndpoints } from "the-moby-effect";

import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Execs tests for $exposeDindContainerBy+$dindBaseImage",
    ({ dindBaseImage, exposeDindContainerBy }) => {
        const testLayer = MobyConnection.connectionOptionsFromPlatformSystemSocketDefault.pipe(
            Effect.map((connectionOptionsToHost) =>
                makePlatformDindLayer({
                    dindBaseImage,
                    exposeDindContainerBy,
                    connectionOptionsToHost,
                })
            ),
            Layer.unwrap,
            Layer.tap((context) =>
                Effect.gen(function* () {
                    const path = yield* Path.Path;
                    const fileSystem = yield* FileSystem.FileSystem;
                    const images = Context.get(context, MobyEndpoints.Images);

                    const fixture1 = yield* path.fromFileUrl(new URL("fixtures/alpine_latest.tar", import.meta.url));
                    const fixture2 = yield* path.fromFileUrl(new URL("fixtures/ubuntu_latest.tar", import.meta.url));

                    const alpineTarBuffer = fileSystem.stream(fixture1);
                    const pullStream = images.import(alpineTarBuffer);
                    yield* MobyConvey.waitForProgressToComplete(pullStream);

                    const ubuntuTarBuffer = fileSystem.stream(fixture2);
                    const pullStream2 = images.import(ubuntuTarBuffer);
                    yield* MobyConvey.waitForProgressToComplete(pullStream2);
                })
            ),
            Layer.provide(NodeServices.layer)
        );

        layer(testLayer, { timeout: Duration.minutes(2) })("MobyApi Execs tests", (it) => {
            it.effect("exec", () =>
                Effect.gen(function* () {
                    // FIXME: can't send the right headers on undici
                    if (makePlatformDindLayer === DindEngine.layerUndici) return;

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

            it.effect(
                "execWebsocketsNonBlocking",
                () =>
                    Effect.gen(function* () {
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
                            Sink.reduce(
                                () => "",
                                (acc, chunk) => acc + chunk
                            ),
                            Sink.reduce(
                                () => "",
                                (acc, chunk) => acc + chunk
                            )
                        );

                        expect(stderr).toBe("");
                        expect(stdout).toBe("ah2\n");
                    }),
                {
                    // Four websocket attaches plus a container wait-and-restart
                    // through a dind daemon does not fit the default timeout on
                    // a loaded machine.
                    timeout: Duration.minutes(1).pipe(Duration.toMillis),
                }
            );
        });
    }
);
