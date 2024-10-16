/**
 * Volumes service
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";

import {
    ClusterVolumeSpec,
    Volume,
    VolumeCreateOptions,
    VolumeListResponse,
    VolumePruneResponse,
} from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const VolumesErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/VolumesError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type VolumesErrorTypeId = typeof VolumesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isVolumesError = (u: unknown): u is VolumesError => Predicate.hasProperty(u, VolumesErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class VolumesError extends PlatformError.TypeIdError(VolumesErrorTypeId, "VolumesError")<{
    method: string;
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * Volumes service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Volumes extends Effect.Service<Volumes>()("@the-moby-effect/endpoints/Volumes", {
    accessors: true,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        const list_ = (
            options?:
                | {
                      readonly filters?: {
                          name?: [string] | undefined;
                          driver?: [string] | undefined;
                          label?: Array<string> | undefined;
                          dangling?: ["true" | "false" | "1" | "0"] | undefined;
                      };
                  }
                | undefined
        ): Effect.Effect<VolumeListResponse, VolumesError> =>
            Function.pipe(
                HttpClientRequest.get("/volumes"),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(VolumeListResponse)),
                Effect.mapError((cause) => new VolumesError({ method: "list", cause })),
                Effect.scoped
            );

        const create_ = (options: VolumeCreateOptions): Effect.Effect<Readonly<Volume>, VolumesError, never> =>
            Function.pipe(
                HttpClientRequest.post("/volumes/create"),
                HttpClientRequest.schemaBodyJson(VolumeCreateOptions)(options),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Volume)),
                Effect.mapError((cause) => new VolumesError({ method: "create", cause })),
                Effect.scoped
            );

        const delete_ = (options: {
            readonly name: string;
            readonly force?: boolean | undefined;
        }): Effect.Effect<void, VolumesError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/volumes/${encodeURIComponent(options.name)}`),
                maybeAddQueryParameter("force", Option.fromNullable(options.force)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new VolumesError({ method: "delete", cause })),
                Effect.scoped
            );

        const inspect_ = (options: { readonly name: string }): Effect.Effect<Readonly<Volume>, VolumesError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/volumes/${encodeURIComponent(options.name)}`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Volume)),
                Effect.mapError((cause) => new VolumesError({ method: "inspect", cause })),
                Effect.scoped
            );

        const update_ = (options: {
            readonly name: string;
            readonly spec: ClusterVolumeSpec;
            readonly version: number;
        }): Effect.Effect<void, VolumesError, never> =>
            Function.pipe(
                HttpClientRequest.put(`/volumes/${encodeURIComponent(options.name)}`),
                maybeAddQueryParameter("version", Option.some(options.version)),
                HttpClientRequest.schemaBodyJson(ClusterVolumeSpec)(options.spec),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new VolumesError({ method: "update", cause })),
                Effect.scoped
            );

        const prune_ = (
            options?:
                | {
                      readonly filters?: {
                          label?: Array<string> | undefined;
                          all?: ["true" | "false" | "1" | "0"] | undefined;
                      };
                  }
                | undefined
        ): Effect.Effect<VolumePruneResponse, VolumesError, never> =>
            Function.pipe(
                HttpClientRequest.post("/volumes/prune"),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(VolumePruneResponse)),
                Effect.mapError((cause) => new VolumesError({ method: "prune", cause })),
                Effect.scoped
            );

        return {
            list: list_,
            create: create_,
            delete: delete_,
            inspect: inspect_,
            update: update_,
            prune: prune_,
        };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Volumes, never, HttpClient.HttpClient> = Volumes.Default;
