import * as NodeSocket from "@effect/experimental/Socket";
import * as NodeSink from "@effect/platform-node/Sink";
import * as NodeStream from "@effect/platform-node/Stream";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Match from "effect/Match";
import * as Schedule from "effect/Schedule";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import * as Containers from "./containers.js";
import * as Images from "./images.js";
import * as Schemas from "./schemas.js";

export class StdinError extends Data.TaggedError("StdinError")<{ message: string }> {}
export class StdoutError extends Data.TaggedError("StdoutError")<{ message: string }> {}

/** Demux an http stream. */
export const demuxSocket = Function.dual<
    <E1, E2>(
        source: Stream.Stream<never, E1, Uint8Array>,
        sink: Sink.Sink<never, E2, string | Uint8Array, never, void>
    ) => (socket: NodeSocket.Socket) => Effect.Effect<never, E1 | E2 | NodeSocket.SocketError, void>,
    <E1, E2>(
        socket: NodeSocket.Socket,
        source: Stream.Stream<never, E1, Uint8Array>,
        sink: Sink.Sink<never, E2, string | Uint8Array, never, void>
    ) => Effect.Effect<never, E1 | E2 | NodeSocket.SocketError, void>
>(
    3,
    <E1, E2>(
        socket: NodeSocket.Socket,
        source: Stream.Stream<never, E1, Uint8Array>,
        sink: Sink.Sink<never, E2, string | Uint8Array, never, void>
    ): Effect.Effect<never, E1 | E2 | NodeSocket.SocketError, void> =>
        Function.pipe(source, Stream.pipeThroughChannel(NodeSocket.toChannel(socket)), Stream.run(sink))
);

/** Demux to stdin and stdout */
export const demuxToStdinAndStdout = demuxSocket(
    NodeStream.fromReadable(
        () => process.stdin,
        () => new StdinError({ message: "stdin is not readable" })
    ),
    NodeSink.fromWritable(
        () => process.stdout,
        () => new StdoutError({ message: "stdout is not writable" }),
        { endOnDone: false }
    )
);

/**
 * Implements the `docker pull` command but it doesn't have all the features
 * that the images create endpoint exposes.
 */
export const pull = ({
    auth,
    image,
    platform,
}: {
    image: string;
    auth?: string | undefined;
    platform?: string | undefined;
}): Effect.Effect<Images.Images, Images.ImagesError, Stream.Stream<never, Images.ImagesError, Schemas.BuildInfo>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const images: Images.Images = yield* _(Images.Images);
        return yield* _(images.create({ fromImage: image, "X-Registry-Auth": auth, platform }));
    });

/**
 * Implements the `docker build` command but it doesn't have all the features
 * that the images build endpoint exposes.
 */
export const build = ({
    tag,
    auth,
    context,
    platform,
    dockerfile,
}: {
    tag: string;
    auth?: string | undefined;
    platform?: string | undefined;
    dockerfile?: string | undefined;
    context: Stream.Stream<never, Images.ImagesError, Uint8Array>;
}): Effect.Effect<Images.Images, Images.ImagesError, Stream.Stream<never, Images.ImagesError, Schemas.BuildInfo>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const images: Images.Images = yield* _(Images.Images);
        return yield* _(images.build({ context, dockerfile, platform, t: tag, "X-Registry-Config": auth }));
    });

/** Implements `docker run` command. */
export const run = ({
    imageOptions,
    containerOptions,
}: {
    imageOptions: ({ kind: "pull" } & Images.ImageCreateOptions) | ({ kind: "build" } & Images.ImageBuildOptions);
    containerOptions: Containers.ContainerCreateOptions;
}): Effect.Effect<
    Containers.Containers | Images.Images,
    Containers.ContainersError | Images.ImagesError,
    Schemas.ContainerInspectResponse
> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const images: Images.Images = yield* _(Images.Images);
        const containers: Containers.Containers = yield* _(Containers.Containers);

        // Start pulling or building the image
        const buildStream: Stream.Stream<never, Images.ImagesError, Schemas.BuildInfo> =
            imageOptions.kind === "pull" ? yield* _(images.create(imageOptions)) : yield* _(images.build(imageOptions));

        // Wait for image pull or build to complete
        yield* _(Stream.runCollect(buildStream));

        // Create the container
        const containerCreateResponse: Readonly<Schemas.ContainerCreateResponse> = yield* _(
            containers.create(containerOptions)
        );

        // Start the container
        yield* _(containers.start({ id: containerCreateResponse.Id }));

        // Helper to wait until a container is dead or running
        const waitUntilContainerDeadOrRunning: Effect.Effect<never, Containers.ContainersError, void> = Function.pipe(
            containers.inspect({ id: containerCreateResponse.Id }),
            Effect.tap(({ State }) => Effect.log(`Waiting for container to be running, state=${State?.Status}`)),
            Effect.flatMap(({ State }) =>
                Function.pipe(
                    Match.value(State?.Status),
                    Match.when(Schemas.ContainerState_Status.RUNNING, (_s) => Effect.unit),
                    Match.when(Schemas.ContainerState_Status.CREATED, (_s) => Effect.fail("Waiting")),
                    Match.orElse((_s) => Effect.fail("Container is dead or killed"))
                ).pipe(Effect.mapError((s) => new Containers.ContainersError({ method: "inspect", message: s })))
            )
        ).pipe(
            Effect.retry(
                Schedule.spaced(500).pipe(
                    Schedule.whileInput(({ message }: Containers.ContainersError) => message === "Waiting")
                )
            )
        );

        // Helper for if the container has a healthcheck, wait for it to report healthy
        const waitUntilContainerHealthy: Effect.Effect<never, Containers.ContainersError, void> = Function.pipe(
            containers.inspect({ id: containerCreateResponse.Id }),
            Effect.tap(({ State }) =>
                Effect.log(`Waiting for container to be healthy, health=${State?.Health?.Status}`)
            ),
            Effect.flatMap(({ State }) =>
                Function.pipe(
                    Match.value(State?.Health?.Status),
                    Match.when(undefined, (_s) => Effect.unit),
                    Match.when(Schemas.Health_Status.HEALTHY, (_s) => Effect.unit),
                    Match.when(Schemas.Health_Status.STARTING, (_s) => Effect.fail("Waiting")),
                    Match.orElse((_s) => Effect.fail("Container is unhealthy"))
                ).pipe(Effect.mapError((s) => new Containers.ContainersError({ method: "inspect", message: s })))
            )
        ).pipe(
            Effect.retry(
                Schedule.spaced(500).pipe(
                    Schedule.whileInput(({ message }: Containers.ContainersError) => message === "Waiting")
                )
            )
        );

        yield* _(waitUntilContainerDeadOrRunning);
        yield* _(waitUntilContainerHealthy);
        return yield* _(containers.inspect({ id: containerCreateResponse.Id }));
    });

/** Implements `docker exec` command. */
export const exec = {};
