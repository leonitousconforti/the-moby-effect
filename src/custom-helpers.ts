import type { IMobyService } from "./main.js";

import { Context, Effect, Match, Schedule, Scope, Stream, pipe } from "effect";

import * as Container from "./containers.js";
import * as Image from "./images.js";
import * as Schemas from "./schemas.js";

/**
 * Attempts to be similar to the `docker run` command. Note that, while this
 * helper will wait for the image build/image pull to complete, it will not
 * expose the build stream directly to you. If you need to do that, you should
 * use the `imageCreate` method directly.
 */
export const run = <ContextIdentifier extends `${string}MobyClient`>({
    mobyClient,
    imageOptions,
    containerOptions,
}: {
    mobyClient: Context.Tag<ContextIdentifier, IMobyService>;
    imageOptions: ({ kind: "pull" } & Image.imageCreateOptions) | ({ kind: "build" } & Image.imageBuildOptions);
    containerOptions: Container.containerCreateOptions;
}): Effect.Effect<
    ContextIdentifier,
    | Image.ImageCreateError
    | Image.ImageBuildError
    | Container.ContainerCreateError
    | Container.ContainerStartError
    | Container.ContainerInspectError,
    Schemas.ContainerInspectResponse
> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const service: IMobyService = yield* _(mobyClient);

        // Start pulling or building the image
        const buildStream: Stream.Stream<never, Image.ImageCreateError, string> =
            imageOptions.kind === "pull"
                ? yield* _(service.imageCreate(imageOptions))
                : yield* _(service.imageBuild(imageOptions));

        // Wait for image pull or build to complete
        yield* _(Stream.runCollect(buildStream));

        // Create the container
        const containerCreateResponse: Readonly<Schemas.ContainerCreateResponse> = yield* _(
            service.containerCreate(containerOptions)
        );

        // Start the container
        yield* _(service.containerStart({ id: containerCreateResponse.Id }));

        // Helper to wait until a container is dead or running
        const waitUntilContainerDeadOrRunning: Effect.Effect<Scope.Scope, Container.ContainerInspectError, void> = pipe(
            service.containerInspect({ id: containerCreateResponse.Id }),
            Effect.tap(({ State }) => Effect.log(`Waiting for container to be running, state=${State?.Status}`)),
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

        yield* _(waitUntilContainerDeadOrRunning);
        return yield* _(service.containerInspect({ id: containerCreateResponse.Id }));
    }).pipe(Effect.scoped);
