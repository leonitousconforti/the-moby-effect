// Run with: npx tsx examples/effect/docker-compose.ts

import { Path, Error as PlatformError } from "@effect/platform";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Array, ConfigError, Effect, Function, Layer, ParseResult, Stream } from "effect";
import { Tar } from "eftar";
import { DockerComposeEngine, MobyConnection, MobyEndpoints } from "the-moby-effect";

const localDockerCompose = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map(DockerComposeEngine.layerNodeJS),
    Layer.unwrapEffect
);

const project = Effect.Do.pipe(
    Effect.bind("cwd", () => Effect.flatMap(Path.Path, (path) => path.fromFileUrl(new URL(".", import.meta.url)))),
    Effect.bind("entries", () => Effect.succeed(Array.make("docker-compose.yml"))),
    Effect.map(({ cwd, entries }) => Tar.tarballFromFilesystem(cwd, entries)),
    Stream.unwrap,
    Stream.provideLayer(NodeContext.layer)
);

const { layer: composeForProjectLayer, tag: composeForProjectTag } = DockerComposeEngine.layerProject(
    project,
    "MyDockerComposeProject"
);

const dockerComposeProjectLive: Layer.Layer<
    DockerComposeEngine.DockerComposeProject,
    | ConfigError.ConfigError
    | MobyEndpoints.SystemsError
    | PlatformError.PlatformError
    | ParseResult.ParseError
    | MobyEndpoints.ContainersError
    | DockerComposeEngine.DockerComposeError,
    never
> = Layer.provide(composeForProjectLayer, localDockerCompose);

const program = Effect.gen(function* () {
    const compose = yield* composeForProjectTag;

    yield* compose.pull({});
    yield* compose.up({});
    yield* Effect.sleep("10 seconds");
    yield* compose.down({});
    yield* compose.rm({});
});

program.pipe(Effect.provide(dockerComposeProjectLive)).pipe(NodeRuntime.runMain);
