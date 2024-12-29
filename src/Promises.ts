/**
 * Docker engine promises api
 *
 * @since 1.0.0
 */

import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Stream from "effect/Stream";
import * as DockerEngine from "./engines/Docker.js";
import * as MobyConvey from "./MobyConvey.js";
import * as MobySchemas from "./MobySchemas.js";

/**
 * Create a promise client for the docker engine
 *
 * @since 1.0.0
 * @category Promises
 */
export const promiseClient = async <E>(
    layer: Layer.Layer<
        Layer.Layer.Success<DockerEngine.DockerLayer>,
        E | Layer.Layer.Error<DockerEngine.DockerLayer>,
        Layer.Layer.Context<DockerEngine.DockerLayer>
    >
) => {
    const managedRuntime = ManagedRuntime.make(layer);
    const runtime = await managedRuntime.runtime();

    return {
        pull: Function.compose(DockerEngine.pull, Stream.toReadableStreamRuntime(runtime)),
        build: Function.compose(DockerEngine.build, Stream.toReadableStreamRuntime(runtime)),
        stop: Function.flow(DockerEngine.stop, managedRuntime.runPromise),
        start: Function.flow(DockerEngine.start, managedRuntime.runPromise),
        run: Function.flow(DockerEngine.run, managedRuntime.runPromise),
        exec: Function.flow(DockerEngine.exec, managedRuntime.runPromise),
        execNonBlocking: Function.flow(DockerEngine.execNonBlocking, managedRuntime.runPromise),
        ps: Function.flow(DockerEngine.ps, managedRuntime.runPromise),
        push: Function.flow(DockerEngine.push, Stream.toReadableStreamRuntime(runtime)),
        images: Function.flow(DockerEngine.images, managedRuntime.runPromise),
        search: Function.flow(DockerEngine.search, managedRuntime.runPromise),
        version: Function.flow(DockerEngine.version, managedRuntime.runPromise),
        info: Function.flow(DockerEngine.info, managedRuntime.runPromise),
        ping: Function.flow(DockerEngine.ping, managedRuntime.runPromise),
        pingHead: Function.flow(DockerEngine.pingHead, managedRuntime.runPromise),
        packBuildContextIntoTarballStream: MobyConvey.packIntoTarballStream,
        followProgressInConsole: Function.flow(
            Stream.fromReadableStream<MobySchemas.JSONMessage, unknown>,
            MobyConvey.followProgressInConsole<unknown, Layer.Layer.Success<typeof layer>>,
            Effect.map(Chunk.toReadonlyArray),
            managedRuntime.runPromise
        ),
        waitForProgressToComplete: Function.flow(
            Stream.fromReadableStream<MobySchemas.JSONMessage, unknown>,
            MobyConvey.waitForProgressToComplete<unknown, Layer.Layer.Success<typeof layer>>,
            Effect.map(Chunk.toReadonlyArray),
            managedRuntime.runPromise
        ),
    };
};
