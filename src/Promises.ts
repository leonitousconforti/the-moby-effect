/**
 * Docker engine promises api
 *
 * @since 1.0.0
 */

import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Match from "effect/Match";
import * as Stream from "effect/Stream";

import type * as MobySchemas from "./MobySchemas.ts";

import * as DockerEngine from "./DockerEngine.ts";
import * as MobyConnection from "./MobyConnection.ts";
import * as MobyConvey from "./MobyConvey.ts";

/**
 * Create a promise client for the docker engine
 *
 * @since 1.0.0
 * @category Promises
 */
export const promiseClient = async <E1, E2>(
    layer: (
        connectionOptions: MobyConnection.MobyConnectionOptions
    ) => Layer.Layer<
        Layer.Success<DockerEngine.DockerLayer>,
        Layer.Error<DockerEngine.DockerLayer> | E1,
        Layer.Services<DockerEngine.DockerLayer>
    >,
    connectionOptions?:
        | MobyConnection.MobyConnectionOptions
        | Effect.Effect<MobyConnection.MobyConnectionOptions, E2, never>
) => {
    const connectionOptionsEffect = Match.value(connectionOptions).pipe(
        Match.when(Match.undefined, () => MobyConnection.connectionOptionsFromPlatformSystemSocketDefault),
        Match.when(Effect.isEffect, (effect) => effect),
        Match.orElse((options) => Effect.succeed(options))
    );

    const unwrappedLayer = connectionOptionsEffect.pipe(
        Effect.map((options) => layer(options)),
        Layer.unwrap
    );

    const managedRuntime = ManagedRuntime.make(unwrappedLayer);
    const services = await managedRuntime.context();

    return {
        pull: Function.compose(DockerEngine.pull, Stream.toReadableStreamWith(services)),
        build: Function.compose(DockerEngine.build, Stream.toReadableStreamWith(services)),
        stop: Function.flow(DockerEngine.stop, managedRuntime.runPromise),
        start: Function.flow(DockerEngine.start, managedRuntime.runPromise),
        run: Function.flow(DockerEngine.run, managedRuntime.runPromise),
        exec: Function.flow(DockerEngine.exec, managedRuntime.runPromise),
        execNonBlocking: Function.flow(DockerEngine.execNonBlocking, managedRuntime.runPromise),
        execWebsockets: Function.flow(DockerEngine.execWebsockets, managedRuntime.runPromise),
        execWebsocketsNonBlocking: Function.compose(DockerEngine.execWebsocketsNonBlocking, (effect) =>
            Stream.toReadableStreamWith(Stream.fromEffect(effect), services)
        ),
        ps: Function.flow(DockerEngine.ps, managedRuntime.runPromise),
        push: Function.flow(DockerEngine.push, Stream.toReadableStreamWith(services)),
        images: Function.flow(DockerEngine.images, managedRuntime.runPromise),
        search: Function.flow(DockerEngine.search, managedRuntime.runPromise),
        version: Function.flow(DockerEngine.version, managedRuntime.runPromise),
        info: Function.flow(DockerEngine.info, managedRuntime.runPromise),
        ping: Function.flow(DockerEngine.ping, managedRuntime.runPromise),
        pingHead: Function.flow(DockerEngine.pingHead, managedRuntime.runPromise),
        followProgressInConsole: Function.flow(
            (readable: ReadableStream<MobySchemas.JSONMessage>) =>
                Stream.fromReadableStream({ evaluate: () => readable, onError: Function.identity }),
            MobyConvey.followProgressInConsole,
            managedRuntime.runPromise
        ),
        waitForProgressToComplete: Function.flow(
            (readable: ReadableStream<MobySchemas.JSONMessage>) =>
                Stream.fromReadableStream({ evaluate: () => readable, onError: Function.identity }),
            MobyConvey.waitForProgressToComplete,
            managedRuntime.runPromise
        ),
    };
};
