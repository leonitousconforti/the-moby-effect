/**
 * Docker helpers
 *
 * @since 1.0.0
 */

import * as Moby from "./Moby.js";

/**
 * @since 1.0.0
 * @category Podman
 */
export const layer = Moby.layer;

// // TODO: Strictly type the return values of these functions

// import * as Effect from "effect/Effect";
// import * as Function from "effect/Function";
// import * as Match from "effect/Match";
// import * as Schedule from "effect/Schedule";
// import * as Scope from "effect/Scope";
// import * as Stream from "effect/Stream";

// import * as Containers from "./moby/Containers.js";
// import * as Images from "./moby/Images.js";
// import * as System from "./moby/System.js";
// import * as Schemas from "./Schemas.js";

// /**
//  * Implements the `docker pull` command.
//  *
//  * Note: it doesn't have all the flags that the images create endpoint exposes.
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const pull = ({
//     auth,
//     image,
//     platform,
// }: {
//     image: string;
//     auth?: string | undefined;
//     platform?: string | undefined;
// }): Stream.Stream<Schemas.BuildInfo, Images.ImagesError, Images.Images | Scope.Scope> =>
//     Effect.gen(function* () {
//         const images: Images.Images = yield* Images.Images;
//         return images.create({ fromImage: image, "X-Registry-Auth": auth, platform });
//     }).pipe(Stream.unwrap);

// /**
//  * Implements the `docker pull` command as a scoped effect. When the scope is
//  * closed, the pulled image is removed.
//  *
//  * Note: it doesn't have all the flags that the images create endpoint exposes.
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const pullScoped = ({
//     auth,
//     image,
//     platform,
// }: {
//     image: string;
//     auth?: string | undefined;
//     platform?: string | undefined;
// }): Effect.Effect<
//     Stream.Stream<Schemas.BuildInfo, Images.ImagesError, never>,
//     Images.ImagesError,
//     Scope.Scope | Images.Images
// > => {
//     const acquire = pull({ image, auth, platform });
//     const release = Images.Images.pipe(
//         Effect.flatMap((images) => images.delete({ name: image })),
//         Effect.orDieWith(
//             (error) => new Images.ImagesError({ ...error, message: `${error.message} when closing the pull scope` })
//         )
//     );
//     return Effect.acquireRelease(acquire, () => release);
// };

// /**
//  * Implements the `docker build` command.
//  *
//  * Note: It doesn't have all the flags that the images build endpoint exposes.
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const build = ({
//     auth,
//     context,
//     dockerfile,
//     platform,
//     tag,
// }: {
//     tag: string;
//     auth?: string | undefined;
//     platform?: string | undefined;
//     dockerfile?: string | undefined;
//     context: Stream.Stream<Uint8Array, Images.ImagesError, never>;
// }): Effect.Effect<
//     Stream.Stream<Schemas.BuildInfo, Images.ImagesError, never>,
//     Images.ImagesError,
//     Images.Images | Scope.Scope
// > =>
//     Effect.gen(function* () {
//         const images: Images.Images = yield* Images.Images;
//         return yield* images.build({ context, dockerfile, platform, t: tag, "X-Registry-Config": auth });
//     });

// /**
//  * Implements the `docker build` command as a scoped effect. When the scope is
//  * closed, the built image is removed.
//  *
//  * Note: It doesn't have all the flags that the images build endpoint exposes.
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const buildScoped = ({
//     auth,
//     context,
//     dockerfile,
//     platform,
//     tag,
// }: {
//     tag: string;
//     auth?: string | undefined;
//     platform?: string | undefined;
//     dockerfile?: string | undefined;
//     context: Stream.Stream<Uint8Array, Images.ImagesError, never>;
// }): Effect.Effect<
//     Stream.Stream<Schemas.BuildInfo, Images.ImagesError, never>,
//     Images.ImagesError,
//     Scope.Scope | Images.Images
// > => {
//     const acquire = build({ tag, auth, context, platform, dockerfile });
//     const release = Images.Images.pipe(
//         Effect.flatMap((images) => images.delete({ name: tag })),
//         Effect.orDieWith(
//             (error) => new Images.ImagesError({ ...error, message: `${error.message} when closing the build scope` })
//         )
//     );
//     return Effect.acquireRelease(acquire, () => release);
// };

// /**
//  * Implements `docker run` command.
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const run = ({
//     containerOptions,
//     imageOptions,
// }: {
//     containerOptions: Containers.ContainerCreateOptions;
//     imageOptions: ({ kind: "pull" } & Images.ImageCreateOptions) | ({ kind: "build" } & Images.ImageBuildOptions);
// }): Effect.Effect<
//     Schemas.ContainerInspectResponse,
//     Containers.ContainersError | Images.ImagesError,
//     Containers.Containers | Images.Images | Scope.Scope
// > =>
//     Effect.gen(function* () {
//         const images: Images.Images = yield* Images.Images;
//         const containers: Containers.Containers = yield* Containers.Containers;

//         // Start pulling or building the image
//         const buildStream: Stream.Stream<Schemas.BuildInfo, Images.ImagesError, never> =
//             imageOptions.kind === "pull" ? yield* images.create(imageOptions) : yield* images.build(imageOptions);

//         // Wait for image pull or build to complete
//         yield* Stream.runCollect(buildStream);

//         // Create the container
//         const containerCreateResponse: Readonly<Schemas.ContainerCreateResponse> =
//             yield* containers.create(containerOptions);

//         // Start the container
//         yield* containers.start({ id: containerCreateResponse.Id });

//         // Helper to wait until a container is dead or running
//         const waitUntilContainerDeadOrRunning: Effect.Effect<void, Containers.ContainersError, never> = Function.pipe(
//             containers.inspect({ id: containerCreateResponse.Id }),
//             Effect.tap(({ State }) => Effect.log(`Waiting for container to be running, state=${State?.Status}`)),
//             Effect.flatMap(({ State }) =>
//                 Function.pipe(
//                     Match.value(State?.Status),
//                     // Match.when("running", (_s) => Effect.void),
//                     // Match.when("created", (_s) => Effect.fail("Waiting")),
//                     Match.when(Schemas.ContainerState_Status.RUNNING, (_s) => Effect.void),
//                     Match.when(Schemas.ContainerState_Status.CREATED, (_s) => Effect.fail("Waiting")),
//                     Match.orElse((_s) => Effect.fail("Container is dead or killed"))
//                 ).pipe(Effect.mapError((s) => new Containers.ContainersError({ method: "inspect", message: s })))
//             )
//         ).pipe(
//             Effect.retry(
//                 Schedule.spaced(500).pipe(
//                     Schedule.whileInput(({ message }: Containers.ContainersError) => message === "Waiting")
//                 )
//             )
//         );

//         // Helper for if the container has a healthcheck, wait for it to report healthy
//         const waitUntilContainerHealthy: Effect.Effect<void, Containers.ContainersError, never> = Function.pipe(
//             containers.inspect({ id: containerCreateResponse.Id }),
//             Effect.tap(({ State }) =>
//                 Effect.log(`Waiting for container to be healthy, health=${State?.Health?.Status}`)
//             ),
//             Effect.flatMap(({ State }) =>
//                 Function.pipe(
//                     Match.value(State?.Health?.Status),
//                     Match.when(undefined, (_s) => Effect.void),
//                     // Match.when("healthy", (_s) => Effect.void),
//                     // Match.when("starting", (_s) => Effect.fail("Waiting")),
//                     Match.when(Schemas.Health_Status.HEALTHY, (_s) => Effect.void),
//                     Match.when(Schemas.Health_Status.STARTING, (_s) => Effect.fail("Waiting")),
//                     Match.orElse((_s) => Effect.fail("Container is unhealthy"))
//                 ).pipe(Effect.mapError((s) => new Containers.ContainersError({ method: "inspect", message: s })))
//             )
//         ).pipe(
//             Effect.retry(
//                 Schedule.spaced(500).pipe(
//                     Schedule.whileInput(({ message }: Containers.ContainersError) => message === "Waiting")
//                 )
//             )
//         );

//         yield* waitUntilContainerDeadOrRunning;
//         yield* waitUntilContainerHealthy;
//         return yield* containers.inspect({ id: containerCreateResponse.Id });
//     });

// /**
//  * Implements `docker run` command as a scoped effect. When the scope is closed,
//  * both the image and the container is removed.
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const runScoped = ({
//     containerOptions,
//     imageOptions,
// }: {
//     containerOptions: Containers.ContainerCreateOptions;
//     imageOptions: ({ kind: "pull" } & Images.ImageCreateOptions) | ({ kind: "build" } & Images.ImageBuildOptions);
// }): Effect.Effect<
//     Schemas.ContainerInspectResponse,
//     Containers.ContainersError | Images.ImagesError,
//     Scope.Scope | Containers.Containers | Images.Images
// > => {
//     const acquire = run({ imageOptions, containerOptions });
//     const release = (containerData: Schemas.ContainerInspectResponse) =>
//         Effect.gen(function* () {
//             const images: Images.ImagesImpl = yield* Images.Images;
//             const containers: Containers.ContainersImpl = yield* Containers.Containers;
//             const imageTag = imageOptions.kind === "pull" ? imageOptions.fromImage : imageOptions.t;

//             // if (!containerData.Id) {
//             //     return new Containers.ContainersError({ method: "delete", message: "Container ID is missing" });
//             // }

//             // if (!imageTag) {
//             //     return new Images.ImagesError({ method: "delete", message: "Image name is missing" });
//             // }

//             yield* containers.kill({ id: containerData.Id });
//             yield* containers.delete({ id: containerData.Id, force: true });
//             yield* images.delete({ name: imageTag });
//             return Effect.void;
//         }).pipe(
//             Effect.catchTags({
//                 ContainersError: (error) =>
//                     Effect.fail(
//                         new Containers.ContainersError({
//                             ...error,
//                             message: `${error.message} when closing the run scope`,
//                         })
//                     ),
//                 ImagesError: (error) =>
//                     Effect.fail(
//                         new Images.ImagesError({ ...error, message: `${error.message} when closing the run scope` })
//                     ),
//             }),
//             Effect.orDie
//         );

//     return Effect.acquireRelease(acquire, release);
// };

// /** Implements `docker exec` command. */
// // export const exec = <T extends boolean | undefined>(
// //     options1: Execs.ContainerExecOptions,
// //     options2: Omit<Schema.Schema.Encoded<typeof Schemas.ExecStartConfig>, "Detach"> & { Detach?: T }
// // ) =>
// //     Effect.gen(function* () {
// //         const execs: Execs.Execs = yield* (Execs.Execs);
// //         const execCreateResponse: Schemas.IdResponse = yield* (execs.container(options1));
// //         return yield* (execs.start<T>({ id: execCreateResponse.Id, execStartConfig: options2 }));
// //     });

// /**
//  * Implements the `docker ps` command.
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const ps = (options?: Containers.ContainerListOptions | undefined) =>
//     Effect.flatMap(Containers.Containers, (containers) => containers.list(options));

// /**
//  * Implements the `docker push` command.
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const push = (
//     options: Images.ImagePushOptions
// ): Stream.Stream<string, Images.ImagesError, Images.Images | Scope.Scope> =>
//     Function.pipe(
//         Images.Images,
//         Effect.map((images) => images.push(options)),
//         Stream.unwrap
//     );

// /**
//  * Implements the `docker images` command. *
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const images = (
//     options?: Images.ImageListOptions | undefined
// ): Effect.Effect<ReadonlyArray<Schemas.ImageSummary>, Images.ImagesError, Images.Images> =>
//     Effect.flatMap(Images.Images, (images) => images.list(options));

// /**
//  * Implements the `docker search` command.
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const search = (options: Images.ImageSearchOptions) =>
//     Effect.flatMap(Images.Images, (images) => images.search(options));

// /**
//  * Implements the `docker version` command.
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const version = Effect.flatMap(System.Systems, (systems) => systems.version());

// /**
//  * Implements the `docker info` command.
//  *
//  * @since 1.0.0
//  * @category Docker
//  */
// export const info = Effect.flatMap(System.Systems, (systems) => systems.info());
