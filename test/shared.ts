import * as Cause from "effect/Cause";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Vitest from "vitest";

export const afterAllTimeout = Duration.seconds(10).pipe(Duration.toMillis);
export const beforeAllTimeout = Duration.seconds(60).pipe(Duration.toMillis);

// -----------------------------------------------------------------------------
// TODO: https://github.com/Effect-TS/effect/pull/3686
// -----------------------------------------------------------------------------

/** @internal */
const handleExit = <E, A>(exit: Exit.Exit<E, A>): Effect.Effect<() => void, never, never> =>
    Effect.gen(function* () {
        if (Exit.isSuccess(exit)) {
            return () => {};
        } else {
            const errors = Cause.prettyErrors(exit.cause);
            for (let i = 1; i < errors.length; i++) {
                yield* Effect.logError(errors[i]);
            }
            return () => {
                throw errors[0];
            };
        }
    });

/** @internal */
const runHook = <E, A>(effect: Effect.Effect<A, E>): Promise<void> =>
    Effect.gen(function* () {
        const exit = yield* Effect.exit(effect);
        return yield* handleExit(exit);
    })
        .pipe(Effect.runPromise)
        .then((f) => f());

export const beforeAllEffect = <E>(
    self: (
        suite: Readonly<Vitest.RunnerTestSuite | Vitest.RunnerTestFile>
    ) => Effect.Effect<Vitest.HookCleanupCallback | PromiseLike<Vitest.HookCleanupCallback>, E, never>,
    timeout?: number
): void => Vitest.beforeAll((suite) => runHook(self(suite)), timeout);

export const beforeEachEffect = <E>(
    self: (
        ctx: Vitest.TaskContext<Vitest.RunnerCustomCase<object> | Vitest.RunnerTestCase<object>> &
            Vitest.TestContext &
            object,
        suite: Vitest.RunnerTestSuite
    ) => Effect.Effect<Vitest.HookCleanupCallback | PromiseLike<Vitest.HookCleanupCallback>, E, never>,
    timeout?: number
): void => Vitest.beforeEach((ctx, suite) => runHook(self(ctx, suite)), timeout);

export const afterAllEffect = <E>(
    self: (
        suite: Readonly<Vitest.RunnerTestSuite | Vitest.RunnerTestFile>
    ) => Effect.Effect<void | PromiseLike<void>, E, never>,
    timeout?: number
): void => Vitest.afterAll((suite) => runHook(self(suite)), timeout);

export const afterEachEffect = <E>(
    self: (
        ctx: Vitest.TaskContext<Vitest.RunnerCustomCase<object> | Vitest.RunnerTestCase<object>> &
            Vitest.TestContext &
            object,
        suite: Vitest.RunnerTestSuite
    ) => Effect.Effect<void | PromiseLike<void>, E, never>,
    timeout?: number
): void => Vitest.afterEach((ctx, suite) => runHook(self(ctx, suite)), timeout);

// -----------------------------------------------------------------------------
// TODO: https://github.com/Effect-TS/effect/pull/3677
// -----------------------------------------------------------------------------

export const provideManagedRuntime = <A, E, E2, R, R2>(
    self: Effect.Effect<A, E, R>,
    runtime: ManagedRuntime.ManagedRuntime<R2, E2>
): Effect.Effect<A, E | E2, Exclude<R, R2>> => Effect.flatMap(runtime.runtimeEffect, (rt) => Effect.provide(self, rt));
