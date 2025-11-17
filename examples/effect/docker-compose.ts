// Run with: pnpx tsx examples/effect/docker-compose.ts

import { Path, Error as PlatformError } from "@effect/platform";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Array, ConfigError, Console, Effect, Function, Layer, ParseResult, Stream } from "effect";
import { Tar } from "eftar";
import { DockerComposeEngine, DockerEngine, MobyConnection } from "the-moby-effect";

// Connect to the local docker engine at "/var/run/docker.sock"
// const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
//     MobyConnection.SocketConnectionOptions({
//         socketPath: "/var/run/docker.sock",
//     })
// );
const localDocker = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect
);

// Create a docker compose layer, using the local docker engine layer
const localDockerCompose = Layer.provide(DockerComposeEngine.layer(), localDocker);

// Get the docker compose project as a tarball
const project = Effect.Do.pipe(
    Effect.bind("cwd", () => Effect.flatMap(Path.Path, (path) => path.fromFileUrl(new URL(".", import.meta.url)))),
    Effect.bind("entries", () => Effect.succeed(Array.make("docker-compose.yml"))),
    Effect.map(({ cwd, entries }) => Tar.tarballFromFilesystem(cwd, entries)),
    Stream.unwrap,
    Stream.provideLayer(NodeContext.layer)
);

// Create a layer for the specific docker compose project
const { layer: composeForProjectLayer, tag: composeForProjectTag } = DockerComposeEngine.layerProject(
    project,
    "MyDockerComposeProject"
);

// Provide the local docker compose engine to the specific docker compose project layer
const dockerComposeProjectLive: Layer.Layer<
    DockerComposeEngine.DockerComposeProject,
    | ConfigError.ConfigError
    | DockerEngine.DockerError
    | PlatformError.PlatformError
    | ParseResult.ParseError
    | DockerComposeEngine.DockerComposeError,
    never
> = Layer.provide(composeForProjectLayer, localDockerCompose);

const program = Effect.gen(function* () {
    const compose = yield* composeForProjectTag;

    const pullStream = compose.pull();
    yield* Stream.runForEach(pullStream, Console.log);
    yield* compose.up(undefined, { detach: true });
    yield* Effect.sleep("10 seconds");
    yield* compose.down();
    yield* compose.rm();
});

program.pipe(Effect.provide(dockerComposeProjectLive)).pipe(NodeRuntime.runMain);
