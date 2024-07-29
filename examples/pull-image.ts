import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

import * as Convey from "the-moby-effect/Convey";
import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as Images from "the-moby-effect/endpoints/Images";
import * as PlatformAgents from "the-moby-effect/PlatformAgents";
import * as Schemas from "the-moby-effect/Schemas";

// Connect to the local docker engine at "/var/run/docker.sock"
const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
    PlatformAgents.SocketConnectionOptions({
        socketPath: "/var/run/docker.sock",
    })
);

// Pull the hello world image, will be removed when the scope is closed
const program = Effect.gen(function* () {
    const pullStream: Stream.Stream<Schemas.JSONMessage, Images.ImagesError, Images.Images> =
        yield* DockerEngine.pullScoped({
            image: "docker.io/library/hello-world:latest",
        });

    yield* Convey.followProgressInConsole(pullStream);
});

program.pipe(Effect.scoped).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
