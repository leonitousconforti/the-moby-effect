/**
 * Docker engine callbacks api
 *
 * @since 1.0.0
 */

import type * as Context from "effect/Context";
import type * as Exit from "effect/Exit";

import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Match from "effect/Match";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";

import type * as MobySchemas from "./MobySchemas.ts";

import * as DockerEngine from "./DockerEngine.ts";
import * as MobyConnection from "./MobyConnection.ts";
import * as MobyConvey from "./MobyConvey.ts";

/**
 * @since 1.0.0
 * @category Callbacks
 */
export const runCallbackForEffect =
    <R = never>(services: Context.Context<R>) =>
    <A = void, E = never>(effect: Effect.Effect<A, E, R>) =>
    (callback: (exit: Exit.Exit<A, E>) => void) =>
        Effect.runCallbackWith(services)(effect, { onExit: callback });

/**
 * @since 1.0.0
 * @category Callbacks
 */
export function runCallback<R = never>(
    services: Context.Context<R>,
    arity: 0
): <A = void, E = never>(
    function_: () => Effect.Effect<A, E, R>
) => (callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(
    services: Context.Context<R>,
    arity: 1
): <Z, A = void, E = never>(
    function_: (z: Z) => Effect.Effect<A, E, R>
) => (z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(
    services: Context.Context<R>,
    arity: 2
): <Y, Z, A = void, E = never>(
    function_: (y: Y, z: Z) => Effect.Effect<A, E, R>
) => (y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(
    services: Context.Context<R>,
    arity: 3
): <X, Y, Z, A = void, E = never>(
    function_: (x: X, y: Y, z: Z) => Effect.Effect<A, E, R>
) => (x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(
    services: Context.Context<R>,
    arity: 4
): <W, X, Y, Z, A = void, E = never>(
    function_: (w: W, x: X, y: Y, z: Z) => Effect.Effect<A, E, R>
) => (w: W, x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(
    services: Context.Context<R>,
    arity: 5
): <V, W, X, Y, Z, A = void, E = never>(
    function_: (v: V, w: W, x: X, y: Y, z: Z) => Effect.Effect<A, E, R>
) => (v: V, w: W, x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(services: Context.Context<R>, arity?: 0 | 1 | 2 | 3 | 4 | 5) {
    return function <V, W, X, Y, Z, A = void, E = never>(
        function_: (
            v?: V | undefined,
            w?: W | undefined,
            x?: X | undefined,
            y?: Y | undefined,
            z?: Z | undefined
        ) => Effect.Effect<A, E, R>
    ) {
        if (Effect.isEffect(function_) || Predicate.isUndefined(arity)) {
            return (callback: (exit: Exit.Exit<A, E>) => void) =>
                runCallbackForEffect(services)(function_ as unknown as Effect.Effect<A, E, R>)(callback);
        }

        switch (arity) {
            case 0:
                return (callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(services)(function_())(callback);
            case 1:
                return (v: V, callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(services)(function_(v))(callback);
            case 2:
                return (v: V, w: W, callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(services)(function_(v, w))(callback);
            case 3:
                return (v: V, w: W, x: X, callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(services)(function_(v, w, x))(callback);
            case 4:
                return (v: V, w: W, x: X, y: Y, callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(services)(function_(v, w, x, y))(callback);
            case 5:
                return (v: V, w: W, x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(services)(function_(v, w, x, y, z))(callback);
        }

        return Function.absurd(arity);
    };
}

/**
 * Create a callback client for the docker engine
 *
 * @since 1.0.0
 * @category Callbacks
 */
export const callbackClient = async <E1, E2>(
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

    const runCallbackZero = runCallback(services, 0);
    const runCallbackSingle = runCallback(services, 1);
    // const runCallbackDouble = runCallback(services, 2);
    // const runCallbackTriple = runCallback(services, 3);
    // const runCallbackQuadruple = runCallback(services, 4);
    // const runCallbackQuintuple = runCallback(services, 5);

    return {
        pull: Function.compose(DockerEngine.pull, Stream.toReadableStreamWith(services)),
        build: Function.compose(DockerEngine.build, Stream.toReadableStreamWith(services)),
        stop: runCallbackSingle(DockerEngine.stop),
        start: runCallbackSingle(DockerEngine.start),
        run: runCallbackSingle(DockerEngine.run),
        exec: runCallbackSingle(DockerEngine.exec),
        execNonBlocking: runCallbackSingle(DockerEngine.execNonBlocking),
        execWebsockets: runCallbackSingle(DockerEngine.execWebsockets),
        execWebsocketsNonBlocking: Function.compose(DockerEngine.execWebsocketsNonBlocking, (effect) =>
            Stream.toReadableStreamWith(Stream.fromEffect(effect), services)
        ),
        ps: runCallbackSingle(DockerEngine.ps),
        push: Function.flow(DockerEngine.push, Stream.toReadableStreamWith(services)),
        images: runCallbackSingle(DockerEngine.images),
        search: runCallbackSingle(DockerEngine.search),
        version: runCallbackZero(DockerEngine.version),
        info: runCallbackZero(DockerEngine.info),
        ping: runCallbackZero(DockerEngine.ping),
        pingHead: runCallbackZero(DockerEngine.pingHead),
        followProgressInConsole: Function.pipe(
            Function.flow(
                (readable: ReadableStream<MobySchemas.JSONMessage>) =>
                    Stream.fromReadableStream({ evaluate: () => readable, onError: Function.identity }),
                MobyConvey.followProgressInConsole<unknown, Layer.Success<ReturnType<typeof layer>>>
            ),
            runCallbackSingle
        ),
        waitForProgressToComplete: Function.pipe(
            Function.flow(
                (readable: ReadableStream<MobySchemas.JSONMessage>) =>
                    Stream.fromReadableStream({ evaluate: () => readable, onError: Function.identity }),
                MobyConvey.waitForProgressToComplete<unknown, Layer.Success<ReturnType<typeof layer>>>
            ),
            runCallbackSingle
        ),
    };
};
