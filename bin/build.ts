#!/usr/bin/env node

import path from "node:path";
import tar from "tar-fs";

import * as Cli from "@effect/cli";
import * as PlatformNode from "@effect/platform-node";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
import * as Stream from "effect/Stream";
import * as String from "effect/String";

import PackageJson from "../package.json" assert { type: "json" };
import * as MobyApi from "../src/index.js";

export const command = Cli.Command.make(
    "build",
    {
        tag: Cli.Options.text("tag"),
        dockerfile: Cli.Options.text("dockerfile").pipe(Cli.Options.withDefault("Dockerfile")),
        context: Cli.Args.directory({ exists: "yes" }),
    },
    ({ tag, dockerfile, context }) =>
        Effect.gen(function* (_: Effect.Adapter) {
            const images: MobyApi.Images.Images = yield* _(MobyApi.Images.Images);

            const buildStream = yield* _(
                images.build({
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
                })
            );

            yield* _(
                Function.pipe(
                    buildStream,
                    Stream.filterMap(({ stream }) => Option.fromNullable(stream)),
                    Stream.filter((text) => text !== "\n"),
                    Stream.map((text) => (String.endsWith("\n")(text) ? text.slice(0, -1) : text)),
                    Stream.runForEach((buildInfo) => Console.log(buildInfo))
                )
            );
        })
);

const cli = Cli.Command.run(command, {
    name: "build",
    version: PackageJson.version,
});

Effect.suspend(() => cli(process.argv.slice(2))).pipe(
    Effect.provide(MobyApi.fromPlatformDefault()),
    Effect.provide(PlatformNode.NodeContext.layer),
    PlatformNode.Runtime.runMain
);
