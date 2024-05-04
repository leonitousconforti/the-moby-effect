import * as HttpClient from "@effect/platform/HttpClient";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { MultiplexedStreamSocket, RawStreamSocket, responseToStreamingSocketOrFail } from "./demux-helpers.js";
import { addQueryParameter, responseErrorHandler } from "./request-helpers.js";
import { ExecConfig, ExecInspectResponse, ExecStartConfig, IdResponse } from "./schemas.js";

export class ExecsError extends Data.TaggedError("ExecsError")<{
    method: string;
    message: string;
}> {}

export interface ContainerExecOptions {
    /** Exec configuration */
    readonly execConfig: Schema.Schema.Type<typeof ExecConfig>;
    /** ID or name of container */
    readonly id: string;
}

export interface ExecStartOptions {
    readonly execStartConfig: Schema.Schema.Type<typeof ExecStartConfig>;
    /** Exec instance ID */
    readonly id: string;
}

export interface ExecResizeOptions {
    /** Exec instance ID */
    readonly id: string;
    /** Height of the TTY session in characters */
    readonly h?: number;
    /** Width of the TTY session in characters */
    readonly w?: number;
}

export interface ExecInspectOptions {
    /** Exec instance ID */
    readonly id: string;
}

export interface Execs {
    /**
     * Create an exec instance
     *
     * @param execConfig - Exec configuration
     * @param id - ID or name of container
     */
    readonly container: (options: ContainerExecOptions) => Effect.Effect<Readonly<IdResponse>, ExecsError>;

    /**
     * Start an exec instance
     *
     * @param execStartConfig -
     * @param id - Exec instance ID
     */
    readonly start: <T extends boolean | undefined>(
        options: ExecStartOptions & {
            execStartConfig: Omit<Schema.Schema.Type<typeof ExecStartConfig>, "Detach"> & { Detach?: T };
        }
    ) => Effect.Effect<T extends true ? void : MultiplexedStreamSocket | RawStreamSocket, ExecsError>;

    /**
     * Resize an exec instance
     *
     * @param id - Exec instance ID
     * @param h - Height of the TTY session in characters
     * @param w - Width of the TTY session in characters
     */
    readonly resize: (options: ExecResizeOptions) => Effect.Effect<void, ExecsError>;

    /**
     * Inspect an exec instance
     *
     * @param id - Exec instance ID
     */
    readonly inspect: (options: ExecInspectOptions) => Effect.Effect<ExecInspectResponse, ExecsError>;
}

const make: Effect.Effect<Execs, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(agent.nodeRequestUrl)),
            HttpClient.client.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.client.transform(Effect.asUnit));
        const IdResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(IdResponse))
        );
        const ExecInspectResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(ExecInspectResponse))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new ExecsError({ method, message }));

        const container_ = (options: ContainerExecOptions): Effect.Effect<Readonly<IdResponse>, ExecsError> =>
            Function.pipe(
                HttpClient.request.post("/containers/{id}/exec".replace("{id}", encodeURIComponent(options.id))),
                HttpClient.request.schemaBody(ExecConfig)(Schema.decodeSync(ExecConfig)(options.execConfig)),
                Effect.flatMap(IdResponseClient),
                Effect.catchAll(responseHandler("container")),
                Effect.scoped
            );

        const start_ = <T extends boolean | undefined>(
            options: ExecStartOptions & {
                execStartConfig: Omit<Schema.Schema.Type<typeof ExecStartConfig>, "Detach"> & { Detach?: T };
            }
        ): Effect.Effect<T extends true ? void : MultiplexedStreamSocket | RawStreamSocket, ExecsError> => {
            type U = Effect.Effect<T extends true ? void : MultiplexedStreamSocket | RawStreamSocket, ExecsError>;

            const response = Function.pipe(
                HttpClient.request.post("/exec/{id}/start".replace("{id}", encodeURIComponent(options.id))),
                HttpClient.request.schemaBody(ExecStartConfig)(
                    Schema.decodeSync(ExecStartConfig)(options.execStartConfig)
                ),
                Effect.flatMap(client),
                Effect.catchAll(responseHandler("start"))
            );

            const detachedResponse: U = Effect.flatMap(response, () => Effect.unit) as U;
            const streamingResponse: U = Function.pipe(
                response,
                Effect.flatMap(responseToStreamingSocketOrFail),
                Effect.catchTag("SocketError", () => new ExecsError({ method: "start", message: "socket error" }))
            ) as U;

            return options.execStartConfig.Detach ? detachedResponse : streamingResponse;
        };

        const resize_ = (options: ExecResizeOptions): Effect.Effect<void, ExecsError> =>
            Function.pipe(
                HttpClient.request.post("/exec/{id}/resize".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("h", options.h),
                addQueryParameter("w", options.w),
                voidClient,
                Effect.catchAll(responseHandler("resize")),
                Effect.scoped
            );

        const inspect_ = (options: ExecInspectOptions): Effect.Effect<ExecInspectResponse, ExecsError> =>
            Function.pipe(
                HttpClient.request.get("/exec/{id}/json".replace("{id}", encodeURIComponent(options.id))),
                ExecInspectResponseClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        return { container: container_, start: start_, resize: resize_, inspect: inspect_ };
    }
);

export const Execs = Context.GenericTag<Execs>("the-moby-effect/Execs");
export const layer = Layer.effect(Execs, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgent, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
