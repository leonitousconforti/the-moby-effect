import type { IMobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import type { MobyError } from "./main.js";

import { Effect, Match, Schedule, Scope, Stream, pipe } from "effect";

import * as Container from "./containers.js";
import * as Image from "./images.js";
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
    imageOptions: ({ kind: "pull" } & Image.ImageCreateOptions) | ({ kind: "build" } & Image.ImageBuildOptions);
    containerOptions: Container.ContainerCreateOptions;
}): Effect.Effect<
    IMobyConnectionAgent,
    | MobyError
    | Image.ImageCreateError
    | Image.ImageBuildError
    | Container.ContainerCreateError
    | Container.ContainerStartError
    | Container.ContainerInspectError,
    Schemas.ContainerInspectResponse
> =>
    Effect.gen(function* (_: Effect.Adapter) {
        // Start pulling or building the image
        const buildStream: Stream.Stream<never, MobyError, string> =
            imageOptions.kind === "pull"
                ? yield* _(Image.imageCreate(imageOptions))
                : yield* _(Image.imageBuild(imageOptions));

        // Wait for image pull or build to complete
        yield* _(Stream.runCollect(buildStream));

        // Create the container
        const containerCreateResponse: Readonly<Schemas.ContainerCreateResponse> = yield* _(
            Container.containerCreate(containerOptions)
        );

        // Start the container
        yield* _(Container.containerStart({ id: containerCreateResponse.Id }));

        // Helper to wait until a container is dead or running
        const waitUntilContainerDeadOrRunning: Effect.Effect<
            IMobyConnectionAgent | Scope.Scope,
            Container.ContainerInspectError,
            void
        > = pipe(
            Container.containerInspect({ id: containerCreateResponse.Id }),
            // Effect.tap(({ State }) => Effect.log(`Waiting for container to be running, state=${State?.Status}`)),
            Effect.flatMap(({ State }) =>
                pipe(
                    Match.value(State?.Status),
                    Match.when(Schemas.ContainerState_StatusEnum.Running, (_s) => Effect.unit),
                    Match.when(Schemas.ContainerState_StatusEnum.Created, (_s) => Effect.fail("Waiting")),
                    Match.orElse((_s) => Effect.fail("Container is dead or killed"))
                ).pipe(Effect.mapError((s) => new Container.ContainerInspectError({ message: s })))
            )
        ).pipe(
            Effect.retry(
                Schedule.spaced(500).pipe(
                    Schedule.whileInput(({ message }: Container.ContainerInspectError) => message === "Waiting")
                )
            )
        );

        // Helper for if the container has a healthcheck, wait for it to report healthy
        const waitUntilContainerHealthy: Effect.Effect<
            IMobyConnectionAgent | Scope.Scope,
            Container.ContainerInspectError,
            void
        > = pipe(
            Container.containerInspect({ id: containerCreateResponse.Id }),
            // Effect.tap(({ State }) =>
            //     Effect.log(`Waiting for container to be healthy, health=${State?.Health?.Status}`)
            // ),
            Effect.flatMap(({ State }) =>
                pipe(
                    Match.value(State?.Health?.Status),
                    Match.when(undefined, (_s) => Effect.unit),
                    Match.when(Schemas.Health_StatusEnum.Healthy, (_s) => Effect.unit),
                    Match.when(Schemas.Health_StatusEnum.Starting, (_s) => Effect.fail("Waiting")),
                    Match.orElse((_s) => Effect.fail("Container is unhealthy"))
                ).pipe(Effect.mapError((s) => new Container.ContainerInspectError({ message: s })))
            )
        ).pipe(
            Effect.retry(
                Schedule.spaced(500).pipe(
                    Schedule.whileInput(({ message }: Container.ContainerInspectError) => message === "Waiting")
                )
            )
        );

        yield* _(waitUntilContainerDeadOrRunning);
        yield* _(waitUntilContainerHealthy);
        return yield* _(Container.containerInspect({ id: containerCreateResponse.Id }));
    }).pipe(Effect.scoped);

/**
 * Attempts to be similar to the `docker run` command. Note that, while this
 * helper will wait for the image build/image pull to complete, it will not
 * expose the build stream directly to you. If you need to do that, you should
 * use the `imageCreate` method directly.
 */
export type runWithConnectionAgentProvided = WithConnectionAgentProvided<typeof run>;
