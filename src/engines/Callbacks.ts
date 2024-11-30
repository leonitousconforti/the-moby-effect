/**
 * Docker engine promises api
 *
 * @since 1.0.0
 */

import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Function from "effect/Function";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Runtime from "effect/Runtime";
import * as Stream from "effect/Stream";
import * as DockerEngine from "./Docker.js";

export const runCallbackEffect =
    <R = never>(runtime: Runtime.Runtime<R>) =>
    <A = void, E = never>(effect: Effect.Effect<A, E, R>) =>
    (callback: (exit: Exit.Exit<A, E>) => void) =>
        Runtime.runCallback(runtime)(effect)(undefined, { onExit: callback });

export function runCallbackThunk<A = void, E = never, R = never>(
    runtime: Runtime.Runtime<R>,
    effect: Effect.Effect<A, E, NoInfer<R>>
): (callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallbackThunk<Z = unknown, A = void, E = never, R = never>(
    runtime: Runtime.Runtime<R>,
    thunk: (z: Z) => Effect.Effect<A, E, NoInfer<R>>
): (z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallbackThunk<Y, Z, A = void, E = never, R = never>(
    runtime: Runtime.Runtime<R>,
    thunk: (y: Y, z: Z) => Effect.Effect<A, E, NoInfer<R>>
): (y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallbackThunk<X, Y, Z, A = void, E = never, R = never>(
    runtime: Runtime.Runtime<R>,
    thunk: (x: X, y: Y, z: Z) => Effect.Effect<A, E, NoInfer<R>>
): (x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallbackThunk<W, X, Y, Z, A = void, E = never, R = never>(
    runtime: Runtime.Runtime<R>,
    thunk: (w: W, x: X, y: Y, z: Z) => Effect.Effect<A, E, NoInfer<R>>
): (w: W, x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallbackThunk<V, W, X, Y, Z, A = void, E = never, R = never>(
    runtime: Runtime.Runtime<R>,
    thunk: (v: V, w: W, x: X, y: Y, z: Z) => Effect.Effect<A, E, NoInfer<R>>
): (v: V, w: W, x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) => void;
export function runCallbackThunk<V, W, X, Y, Z, A = void, E = never, R = never>(
    runtime: Runtime.Runtime<R>,
    thunk:
        | ((
              v?: V | undefined,
              w?: W | undefined,
              x?: X | undefined,
              y?: Y | undefined,
              z?: Z | undefined
          ) => Effect.Effect<A, E, NoInfer<R>>)
        | Effect.Effect<A, E, NoInfer<R>>
) {
    if (Effect.isEffect(thunk)) {
        return (callback: (exit: Exit.Exit<A, E>) => void) => runCallbackEffect(runtime)(thunk)(callback);
    }

    switch (thunk.arguments.length) {
        case 0:
            return (callback: (exit: Exit.Exit<A, E>) => void) => runCallbackEffect(runtime)(thunk())(callback);
        case 1:
            return (v: V, callback: (exit: Exit.Exit<A, E>) => void) => runCallbackEffect(runtime)(thunk(v))(callback);
        case 2:
            return (v: V, w: W, callback: (exit: Exit.Exit<A, E>) => void) =>
                runCallbackEffect(runtime)(thunk(v, w))(callback);
        case 3:
            return (v: V, w: W, x: X, callback: (exit: Exit.Exit<A, E>) => void) =>
                runCallbackEffect(runtime)(thunk(v, w, x))(callback);
        case 4:
            return (v: V, w: W, x: X, y: Y, callback: (exit: Exit.Exit<A, E>) => void) =>
                runCallbackEffect(runtime)(thunk(v, w, x, y))(callback);
        case 5:
            return (v: V, w: W, x: X, y: Y, z: Z, callback: (exit: Exit.Exit<A, E>) => void) =>
                runCallbackEffect(runtime)(thunk(v, w, x, y, z))(callback);
    }
    return;
}

export const callbackClient = async (layer: DockerEngine.DockerLayer) => {
    const managedRuntime = ManagedRuntime.make(layer);
    const runtime = await managedRuntime.runtime();

    return {
        pull: Function.compose(DockerEngine.pull, Stream.toReadableStreamRuntime(runtime)),
        build: Function.compose(DockerEngine.build, Stream.toReadableStreamRuntime(runtime)),
        stop: runCallbackThunk(runtime, DockerEngine.stop),
        start: runCallbackThunk(runtime, DockerEngine.start),
        run: runCallbackThunk(runtime, DockerEngine.run),
        exec: runCallbackThunk(runtime, DockerEngine.exec),
        execNonBlocking: runCallbackThunk(runtime, DockerEngine.execNonBlocking),
        ps: runCallbackThunk(runtime, DockerEngine.ps),
        push: Function.compose(DockerEngine.push, Stream.toReadableStreamRuntime(runtime)),
        images: runCallbackThunk(runtime, DockerEngine.images),
        search: runCallbackThunk(runtime, DockerEngine.search),
        version: runCallbackThunk(runtime, DockerEngine.version()),
        info: runCallbackThunk(runtime, DockerEngine.info()),
        ping: runCallbackThunk(runtime, DockerEngine.ping()),
        pingHead: runCallbackThunk(runtime, DockerEngine.pingHead()),
    };
};
