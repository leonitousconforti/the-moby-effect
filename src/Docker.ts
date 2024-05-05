import * as Schema from "@effect/schema/Schema";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Match from "effect/Match";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";

import * as Containers from "./Containers.js";
import * as Execs from "./Execs.js";
import * as Images from "./Images.js";
import * as Schemas from "./Schemas.js";
import * as System from "./System.js";

/**
 * Implements the `docker pull` command.
 *
 * Note: it doesn't have all the flags that the images create endpoint exposes.
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
 * Implements the `docker pull` command as a scoped effect. When the scope is
 * closed, the pulled image is removed.
 *
 * Note: it doesn't have all the flags that the images create endpoint exposes.
 */
export const pullScoped = ({
    auth,
    image,
    platform,
}: {
    image: string;
    auth?: string | undefined;
    platform?: string | undefined;
}): Effect.Effect<
    Scope.Scope | Images.Images,
    Images.ImagesError,
    Stream.Stream<never, Images.ImagesError, Schemas.BuildInfo>
> => {
    const acquire = pull({ image, auth, platform });
    const release = Images.Images.pipe(
        Effect.flatMap((images) => images.delete({ name: image })),
        Effect.orDieWith(
            (error) => new Images.ImagesError({ ...error, message: `${error.message} when closing the pull scope` })
        )
    );
    return Effect.acquireRelease(acquire, () => release);
};

/**
 * Implements the `docker build` command.
 *
 * Note: It doesn't have all the flags that the images build endpoint exposes.
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

/**
 * Implements the `docker build` command as a scoped effect. When the scope is
 * closed, the built image is removed.
 *
 * Note: It doesn't have all the flags that the images build endpoint exposes.
 */
export const buildScoped = ({
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
}): Effect.Effect<
    Scope.Scope | Images.Images,
    Images.ImagesError,
    Stream.Stream<never, Images.ImagesError, Schemas.BuildInfo>
> => {
    const acquire = build({ tag, auth, context, platform, dockerfile });
    const release = Images.Images.pipe(
        Effect.flatMap((images) => images.delete({ name: tag })),
        Effect.orDieWith(
            (error) => new Images.ImagesError({ ...error, message: `${error.message} when closing the build scope` })
        )
    );
    return Effect.acquireRelease(acquire, () => release);
};

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
                    Match.when(Schemas.ContainerState_Status.RUNNING, (_s) => Effect.void),
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
                    Match.when(undefined, (_s) => Effect.void),
                    Match.when(Schemas.Health_Status.HEALTHY, (_s) => Effect.void),
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
 * Implements `docker run` command as a scoped effect. When the scope is closed,
 * both the image and the container is removed.
 */
export const runScoped = ({
    imageOptions,
    containerOptions,
}: {
    imageOptions: ({ kind: "pull" } & Images.ImageCreateOptions) | ({ kind: "build" } & Images.ImageBuildOptions);
    containerOptions: Containers.ContainerCreateOptions;
}): Effect.Effect<
    Scope.Scope | Containers.Containers | Images.Images,
    Containers.ContainersError | Images.ImagesError,
    Schemas.ContainerInspectResponse
> => {
    const acquire = run({ imageOptions, containerOptions });
    const release = (containerData: Schemas.ContainerInspectResponse) =>
        Effect.gen(function* (_: Effect.Adapter) {
            const images: Images.Images = yield* _(Images.Images);
            const containers: Containers.Containers = yield* _(Containers.Containers);
            const imageTag = imageOptions.kind === "pull" ? imageOptions.fromImage : imageOptions.t;

            if (!containerData.Id) {
                return new Containers.ContainersError({ method: "delete", message: "Container ID is missing" });
            }

            if (!imageTag) {
                return new Images.ImagesError({ method: "delete", message: "Image name is missing" });
            }

            yield* _(containers.kill({ id: containerData.Id }));
            yield* _(containers.delete({ id: containerData.Id, force: true }));
            yield* _(images.delete({ name: imageTag }));
            return Effect.void;
        }).pipe(
            Effect.catchTags({
                ContainersError: (error) =>
                    Effect.fail(
                        new Containers.ContainersError({
                            ...error,
                            message: `${error.message} when closing the run scope`,
                        })
                    ),
                ImagesError: (error) =>
                    Effect.fail(
                        new Images.ImagesError({ ...error, message: `${error.message} when closing the run scope` })
                    ),
            }),
            Effect.orDie
        );

    return Effect.acquireRelease(acquire, release);
};

/** Implements `docker exec` command. */
export const exec = <T extends boolean | undefined>(
    options1: Execs.ContainerExecOptions,
    options2: Omit<Schema.Schema.To<typeof Schemas.ExecStartConfig.struct>, "Detach"> & { Detach?: T }
) =>
    Effect.gen(function* (_) {
        const execs: Execs.Execs = yield* _(Execs.Execs);
        const execCreateResponse: Schemas.IdResponse = yield* _(execs.container(options1));
        return yield* _(execs.start<T>({ id: execCreateResponse.Id, execStartConfig: options2 }));
    });

/** Implements the `docker ps` command. */
export const ps = (options?: Containers.ContainerListOptions | undefined) =>
    Effect.flatMap(Containers.Containers, (containers) => containers.list(options));

/** Implements the `docker push` command. */
export const push = (options: Images.ImagePushOptions) =>
    Effect.flatMap(Images.Images, (images) => images.push(options));

/** Implements the `docker images` command. */
export const images = (options?: Images.ImageListOptions | undefined) =>
    Effect.flatMap(Images.Images, (images) => images.list(options));

/** Implements the `docker search` command. */
export const search = (options: Images.ImageSearchOptions) =>
    Effect.flatMap(Images.Images, (images) => images.search(options));

/** Implements the `docker version` command. */
export const version = Effect.flatMap(System.Systems, (systems) => systems.version());

/** Implements the `docker info` command. */
export const info = Effect.flatMap(System.Systems, (systems) => systems.info());
