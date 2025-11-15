import { FileSystem, Path } from "@effect/platform";
import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Context, Duration, Effect, Layer } from "effect";
import { DockerEngine, MobyConnection, MobyConvey, MobyEndpoints } from "the-moby-effect";
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
                        const fixture = yield* path.fromFileUrl(new URL("fixtures/alpine_latest.tar", import.meta.url));
                        const alpineTarBuffer = fileSystem.stream(fixture);
                        const pullStream = images.import(alpineTarBuffer);
                        yield* MobyConvey.waitForProgressToComplete(pullStream);
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

            it.scoped("execWebsockets", () =>
                Effect.gen(function* () {
                    const { Id: id } = yield* DockerEngine.runScoped({
                        Image: "docker.io/library/alpine:latest",
                        Entrypoint: ["/bin/sh", "-c"],
                    });

                    const [stdout, stderr] = yield* DockerEngine.execWebsockets({
                        containerId: id,
                        command: ["echo", "hello world"],
                    });

                    expect(stderr).toBe("");
                    expect(stdout).toBe("hello world\n");
                })
            );
        });
    }
);
