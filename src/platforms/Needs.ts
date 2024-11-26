/**
 * Helper types for requiring certain packages to be installed.
 *
 * @since 1.0.0
 */

import type * as Effect from "effect/Effect";
import type * as Layer from "effect/Layer";

/**
 * @since 1.0.0
 * @category Types
 * @internal
 */
export type HasPackage<T> = [unknown] extends [T] ? "no" : "yes";

/**
 * @since 1.0.0
 * @category Types
 */
export type NeedsSSH2<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> = HasPackage<typeof import("ssh2")> extends "yes" ? Dependent : 'Missing "ssh2" package';

/**
 * @since 1.0.0
 * @category Types
 */
export type NeedsUndici<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> = HasPackage<typeof import("undici")> extends "yes" ? Dependent : 'Missing "undici" package';

/**
 * @since 1.0.0
 * @category Types
 */
export type NeedsNodeHttp<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> = HasPackage<typeof import("node:http")> extends "yes" ? Dependent : 'Missing "node:http" package';

/**
 * @since 1.0.0
 * @category Types
 */
export type NeedsNodeHttps<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> = HasPackage<typeof import("node:https")> extends "yes" ? Dependent : 'Missing "node:https" package';

/**
 * @since 1.0.0
 * @category Types
 */
export type NeedsPlatformNode<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> =
    HasPackage<typeof import("@effect/platform-node")> extends "yes"
        ? Dependent
        : 'Missing "@effect/platform-node" package';

/**
 * @since 1.0.0
 * @category Types
 */
export type NeedsPlatformBun<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> =
    HasPackage<typeof import("@effect/platform-bun")> extends "yes"
        ? Dependent
        : 'Missing "@effect/platform-bun" package';

/**
 * @since 1.0.0
 * @category Types
 */
export type NeedsPlatformBrowser<
    Dependent extends Effect.Effect<unknown, unknown, unknown> | Layer.Layer<unknown, unknown, unknown>,
> =
    HasPackage<typeof import("@effect/platform-browser")> extends "yes"
        ? Dependent
        : 'Missing "@effect/platform-browser" package';
