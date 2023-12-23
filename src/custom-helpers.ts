import { Effect, Match, Schedule, Stream, pipe } from "effect";

import * as Containers from "./containers.js";
import * as Images from "./images.js";
import * as Schemas from "./schemas.js";

/**
 * Attempts to be similar to the `docker run` command. Note that, while this
 * helper will wait for the image build/image pull to complete, it will not
 * expose the build stream directly to you. If you need to do that, you should
 * use the `imageCreate` method directly.
 */
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
        const buildStream: Stream.Stream<never, Images.ImagesError, string> =
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
        const waitUntilContainerDeadOrRunning: Effect.Effect<never, Containers.ContainersError, void> = pipe(
            containers.inspect({ id: containerCreateResponse.Id }),
            // Effect.tap(({ State }) => Effect.log(`Waiting for container to be running, state=${State?.Status}`)),
            Effect.flatMap(({ State }) =>
                pipe(
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
        const waitUntilContainerHealthy: Effect.Effect<never, Containers.ContainersError, void> = pipe(
            containers.inspect({ id: containerCreateResponse.Id }),
            // Effect.tap(({ State }) =>
            //     Effect.log(`Waiting for container to be healthy, health=${State?.Health?.Status}`)
            // ),
            Effect.flatMap(({ State }) =>
                pipe(
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

/**
 * Scoped version of `run` where once the scope is closed the container is
 * stopped and destroyed.
 */
export const runScoped = "a"; // Effect.acquireRelease(run, () => "");
