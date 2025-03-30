import type * as Effect from "effect/Effect";
import type * as Layer from "effect/Layer";

/** @internal */
export type HasPackage<T> = [unknown] extends [T] ? "no" : "yes";

/** @internal */
export type NeedsSSH2<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> = HasPackage<typeof import("ssh2")> extends "yes" ? Dependent : 'Missing "ssh2" package';

/** @internal */
export type NeedsUndici<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> = HasPackage<typeof import("undici")> extends "yes" ? Dependent : 'Missing "undici" package';

/** @internal */
export type NeedsNodeHttp<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> = HasPackage<typeof import("node:http")> extends "yes" ? Dependent : 'Missing "node:http" package';

/** @internal */
export type NeedsNodeHttps<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> = HasPackage<typeof import("node:https")> extends "yes" ? Dependent : 'Missing "node:https" package';

/** @internal */
export type NeedsPlatformNode<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> =
    HasPackage<typeof import("@effect/platform-node")> extends "yes"
        ? Dependent
        : 'Missing "@effect/platform-node" package';

/** @internal */
export type NeedsPlatformBun<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> =
    HasPackage<typeof import("@effect/platform-bun")> extends "yes"
        ? Dependent
        : 'Missing "@effect/platform-bun" package';

/** @internal */
export type NeedsPlatformBrowser<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> =
    HasPackage<typeof import("@effect/platform-browser")> extends "yes"
        ? Dependent
        : 'Missing "@effect/platform-browser" package';
