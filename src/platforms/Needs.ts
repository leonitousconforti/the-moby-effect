/**
 * Helper types for requiring certain packages to be installed.
 *
 * @since 1.0.0
 */

// import type * as Effect from "effect/Effect";
// import type * as Layer from "effect/Layer";

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
// export type NeedsSSH2<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
//     HasPackage<typeof import("ssh2")> extends "yes"
//         ? Dependent
//         : Dependent extends Effect.Effect<any, any, any>
//           ? Effect.Effect<never, 'Missing "ssh2" package', never>
//           : Layer.Layer<any, 'Missing "ssh2" package', never>;

/**
 * @since 1.0.0
 * @category Types
 */
// export type NeedsUndici<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
//     HasPackage<typeof import("undici")> extends "yes"
//         ? Dependent
//         : Dependent extends Effect.Effect<any, any, any>
//           ? Effect.Effect<never, 'Missing "undici" package', never>
//           : Layer.Layer<any, 'Missing "undici" package', never>;

/**
 * @since 1.0.0
 * @category Types
 */
// export type NeedsNodeHttp<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
//     HasPackage<typeof import("node:http")> extends "yes"
//         ? Dependent
//         : Dependent extends Effect.Effect<any, any, any>
//           ? Effect.Effect<never, 'Missing "node:http" package', never>
//           : Layer.Layer<any, 'Missing "node:http" package', never>;

/**
 * @since 1.0.0
 * @category Types
 */
// export type NeedsNodeHttps<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
//     HasPackage<typeof import("node:https")> extends "yes"
//         ? Dependent
//         : Dependent extends Effect.Effect<any, any, any>
//           ? Effect.Effect<never, 'Missing "node:https" package', never>
//           : Layer.Layer<any, 'Missing "node:https" package', never>;

/**
 * @since 1.0.0
 * @category Types
 */
// export type NeedsPlatformNode<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
//     HasPackage<typeof import("@effect/platform-node")> extends "yes"
//         ? Dependent
//         : Dependent extends Effect.Effect<any, any, any>
//           ? Effect.Effect<never, 'Missing "@effect/platform-node" package', never>
//           : Layer.Layer<any, 'Missing "@effect/platform-node" package', never>;

/**
 * @since 1.0.0
 * @category Types
 */
// export type NeedsPlatformBrowser<Dependent extends Effect.Effect<any, any, any> | Layer.Layer<any, any, any>> =
//     HasPackage<typeof import("@effect/platform-browser")> extends "yes"
//         ? Dependent
//         : Dependent extends Effect.Effect<any, any, any>
//           ? Effect.Effect<never, 'Missing "@effect/platform-browser" package', never>
//           : Layer.Layer<any, 'Missing "@effect/platform-browser" package', never>;
