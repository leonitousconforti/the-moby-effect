import * as NodeHttp from "@effect/platform-node/HttpClient";
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
    readonly execConfig: Schema.Schema.To<typeof ExecConfig.struct>;
    /** ID or name of container */
    readonly id: string;
}

export interface ExecStartOptions {
    readonly execStartConfig: Schema.Schema.To<typeof ExecStartConfig.struct>;
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
    readonly container: (options: ContainerExecOptions) => Effect.Effect<never, ExecsError, Readonly<IdResponse>>;

    /**
     * Start an exec instance
     *
     * @param execStartConfig -
     * @param id - Exec instance ID
     */
    readonly start: <T extends boolean | undefined>(
        options: ExecStartOptions & {
            execStartConfig: Omit<Schema.Schema.To<typeof ExecStartConfig.struct>, "Detach"> & { Detach?: T };
        }
    ) => Effect.Effect<never, ExecsError, T extends true ? void : MultiplexedStreamSocket | RawStreamSocket>;

    /**
     * Resize an exec instance
     *
     * @param id - Exec instance ID
     * @param h - Height of the TTY session in characters
     * @param w - Width of the TTY session in characters
     */
    readonly resize: (options: ExecResizeOptions) => Effect.Effect<never, ExecsError, void>;

    /**
     * Inspect an exec instance
     *
     * @param id - Exec instance ID
     */
    readonly inspect: (options: ExecInspectOptions) => Effect.Effect<never, ExecsError, ExecInspectResponse>;
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, Execs> = Effect.gen(function* (
    _: Effect.Adapter
) {
    const agent = yield* _(MobyConnectionAgent);
    const defaultClient = yield* _(NodeHttp.client.Client);

    const client = defaultClient.pipe(
        NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(agent.nodeRequestUrl)),
        NodeHttp.client.filterStatusOk
    );

    const voidClient = client.pipe(NodeHttp.client.transform(Effect.asUnit));
    const IdResponseClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(IdResponse)));
    const ExecInspectResponseClient = client.pipe(
        NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(ExecInspectResponse))
    );

    const responseHandler = (method: string) => responseErrorHandler((message) => new ExecsError({ method, message }));

    const container_ = (options: ContainerExecOptions): Effect.Effect<never, ExecsError, Readonly<IdResponse>> =>
        Function.pipe(
            NodeHttp.request.post("/containers/{id}/exec".replace("{id}", encodeURIComponent(options.id))),
            NodeHttp.request.schemaBody(ExecConfig)(Schema.decodeSync(ExecConfig)(options.execConfig)),
            Effect.flatMap(IdResponseClient),
            Effect.catchAll(responseHandler("container"))
        );

    const start_ = <T extends boolean | undefined>(
        options: ExecStartOptions & {
            execStartConfig: Omit<Schema.Schema.To<typeof ExecStartConfig.struct>, "Detach"> & { Detach?: T };
        }
    ): Effect.Effect<never, ExecsError, T extends true ? void : MultiplexedStreamSocket | RawStreamSocket> => {
        type U = Effect.Effect<never, ExecsError, T extends true ? void : MultiplexedStreamSocket | RawStreamSocket>;

        const response = Function.pipe(
            NodeHttp.request.post("/exec/{id}/start".replace("{id}", encodeURIComponent(options.id))),
            NodeHttp.request.schemaBody(ExecStartConfig)(Schema.decodeSync(ExecStartConfig)(options.execStartConfig)),
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

    const resize_ = (options: ExecResizeOptions): Effect.Effect<never, ExecsError, void> =>
        Function.pipe(
            NodeHttp.request.post("/exec/{id}/resize".replace("{id}", encodeURIComponent(options.id))),
            addQueryParameter("h", options.h),
            addQueryParameter("w", options.w),
            voidClient,
            Effect.catchAll(responseHandler("resize"))
        );

    const inspect_ = (options: ExecInspectOptions): Effect.Effect<never, ExecsError, ExecInspectResponse> =>
        Function.pipe(
            NodeHttp.request.get("/exec/{id}/json".replace("{id}", encodeURIComponent(options.id))),
            ExecInspectResponseClient,
            Effect.catchAll(responseHandler("inspect"))
        );

    return { container: container_, start: start_, resize: resize_, inspect: inspect_ };
});

export const Execs = Context.Tag<Execs>("the-moby-effect/Execs");
export const layer = Layer.effect(Execs, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
