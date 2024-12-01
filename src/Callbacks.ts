/**
 * Docker engine callbacks api
 *
 * @since 1.0.0
 */

import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Predicate from "effect/Predicate";
import * as Runtime from "effect/Runtime";
import * as Stream from "effect/Stream";
import * as DockerEngine from "./engines/Docker.js";

/** @internal */
export const runCallbackForEffect =
    <R = never>(runtime: Runtime.Runtime<R>) =>
    <A = void, E = never>(effect: Effect.Effect<A, E, R>) =>
    (callback: (exit: Exit.Exit<A, E>) => void) =>
        Runtime.runCallback(runtime)(effect, { onExit: callback });

/** @internal */
export function runCallback<R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 0
): <A = void, E = never>(
    function_: () => Effect.Effect<A, E, R>
) => (callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 1
): <Z, A = void, E = never>(
    function_: (z: Z) => Effect.Effect<A, E, R>
) => (z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 2
): <Y, Z, A = void, E = never>(
    function_: (y: Y, z: Z) => Effect.Effect<A, E, R>
) => (y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 3
): <X, Y, Z, A = void, E = never>(
    function_: (x: X, y: Y, z: Z) => Effect.Effect<A, E, R>
) => (x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 4
): <W, X, Y, Z, A = void, E = never>(
    function_: (w: W, x: X, y: Y, z: Z) => Effect.Effect<A, E, R>
) => (w: W, x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(
    runtime: Runtime.Runtime<R>,
    arity: 5
): <V, W, X, Y, Z, A = void, E = never>(
    function_: (v: V, w: W, x: X, y: Y, z: Z) => Effect.Effect<A, E, R>
) => (v: V, w: W, x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallback<R = never>(runtime: Runtime.Runtime<R>, arity?: 0 | 1 | 2 | 3 | 4 | 5) {
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
                runCallbackForEffect(runtime)(function_ as unknown as Effect.Effect<A, E, R>)(callback);
        }

        switch (arity) {
            case 0:
                return (callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(runtime)(function_())(callback);
            case 1:
                return (v: V, callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(runtime)(function_(v))(callback);
            case 2:
                return (v: V, w: W, callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(runtime)(function_(v, w))(callback);
            case 3:
                return (v: V, w: W, x: X, callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(runtime)(function_(v, w, x))(callback);
            case 4:
                return (v: V, w: W, x: X, y: Y, callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(runtime)(function_(v, w, x, y))(callback);
            case 5:
                return (v: V, w: W, x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) =>
                    runCallbackForEffect(runtime)(function_(v, w, x, y, z))(callback);
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
export const callbackClient = async <E>(
    layer: Layer.Layer<
        Layer.Layer.Success<DockerEngine.DockerLayer>,
        E | Layer.Layer.Error<DockerEngine.DockerLayer>,
        Layer.Layer.Context<DockerEngine.DockerLayer>
    >
) => {
    const managedRuntime = ManagedRuntime.make(layer);
    const runtime = await managedRuntime.runtime();

    const runCallbackZero = runCallback(runtime, 0);
    const runCallbackSingle = runCallback(runtime, 1);
    // const runCallbackDouble = runCallback(runtime, 2);
    // const runCallbackTriple = runCallback(runtime, 3);
    // const runCallbackQuadruple = runCallback(runtime, 4);
    // const runCallbackQuintuple = runCallback(runtime, 5);

    return {
        pull: Function.compose(DockerEngine.pull, Stream.toReadableStreamRuntime(runtime)),
        build: Function.compose(DockerEngine.build, Stream.toReadableStreamRuntime(runtime)),
        stop: runCallbackSingle(DockerEngine.stop),
        start: runCallbackSingle(DockerEngine.start),
        run: runCallbackSingle(DockerEngine.run),
        exec: runCallbackSingle(DockerEngine.exec),
        execNonBlocking: runCallbackSingle(DockerEngine.execNonBlocking),
        ps: runCallbackSingle(DockerEngine.ps),
        push: Function.compose(DockerEngine.push, Stream.toReadableStreamRuntime(runtime)),
        images: runCallbackSingle(DockerEngine.images),
        search: runCallbackSingle(DockerEngine.search),
        version: runCallbackZero(DockerEngine.version),
        info: runCallbackZero(DockerEngine.info),
        ping: runCallbackZero(DockerEngine.ping),
        pingHead: runCallbackZero(DockerEngine.pingHead),
    };
};
