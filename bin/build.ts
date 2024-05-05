#!/usr/bin/env node

import * as path from "node:path";
import * as tar from "tar-fs";

import * as Cli from "@effect/cli";
import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
import * as Stream from "effect/Stream";
import * as String from "effect/String";

import * as MobyApi from "the-moby-effect/Moby";
import PackageJson from "../package.json" assert { type: "json" };

export const command = Cli.Command.make(
    "build",
    {
        tag: Cli.Options.text("tag"),
        dockerfile: Cli.Options.text("dockerfile").pipe(Cli.Options.withDefault("Dockerfile")),
        context: Cli.Args.directory({ exists: "yes" }),
    },
    ({ context, dockerfile, tag }) =>
        Effect.gen(function* () {
            const images: MobyApi.Images.Images = yield* MobyApi.Images.Images;

            const buildStream = yield* images.build({
                context: Stream.fromAsyncIterable(
                    tar.pack(path.join(process.cwd(), context)),
                    () =>
                        new MobyApi.Images.ImagesError({
                            method: "buildStream",
                            message: "error packing the build context",
                        })
                ),
                dockerfile,
                t: tag,
            });

            yield* Function.pipe(
                buildStream,
                Stream.filterMap(({ stream }) => Option.fromNullable(stream)),
                Stream.filter((text) => text !== "\n"),
                Stream.map((text) => (String.endsWith("\n")(text) ? text.slice(0, -1) : text)),
                Stream.runForEach((buildInfo) => Console.log(buildInfo))
            );
        }).pipe(Effect.scoped)
);

const cli = Cli.Command.run(command, {
    name: "build",
    version: PackageJson.version,
});

Effect.suspend(() => cli(process.argv.slice(2))).pipe(
    Effect.provide(MobyApi.fromPlatformDefault()),
    Effect.provide(NodeContext.layer),
    NodeRuntime.runMain
);
