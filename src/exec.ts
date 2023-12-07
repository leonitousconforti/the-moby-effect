import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Data, Effect } from "effect";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    WithConnectionAgentProvided,
    addHeader,
    addQueryParameter,
    errorHandler,
    setBody,
} from "./request-helpers.js";

import {
    ExecConfig,
    ExecInspectResponse,
    ExecInspectResponseSchema,
    ExecStartConfig,
    IdResponse,
    IdResponseSchema,
} from "./schemas.js";

export class containerExecError extends Data.TaggedError("containerExecError")<{ message: string }> {}
export class execInspectError extends Data.TaggedError("execInspectError")<{ message: string }> {}
export class execResizeError extends Data.TaggedError("execResizeError")<{ message: string }> {}
export class execStartError extends Data.TaggedError("execStartError")<{ message: string }> {}

export interface containerExecOptions {
    /** Exec configuration */
    body: ExecConfig;
    /** ID or name of container */
    id: string;
}

export interface execInspectOptions {
    /** Exec instance ID */
    id: string;
}

export interface execResizeOptions {
    /** Exec instance ID */
    id: string;
    /** Height of the TTY session in characters */
    h?: number;
    /** Width of the TTY session in characters */
    w?: number;
}

export interface execStartOptions {
    /** Exec instance ID */
    id: string;
    body?: ExecStartConfig;
}

/**
 * Run a command inside a running container.
 *
 * @param body - Exec configuration
 * @param id - ID or name of container
 */
export const containerExec = (
    options: containerExecOptions
): Effect.Effect<IMobyConnectionAgent, containerExecError, Readonly<IdResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new containerExecError({ message: "Required parameter body was null or undefined" }));
        }

        if (options.id === null || options.id === undefined) {
            yield* _(new containerExecError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/containers/{id}/exec";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "ExecConfig"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(IdResponseSchema)))
            .pipe(errorHandler(containerExecError));
    }).pipe(Effect.flatten);

/**
 * Return low-level information about an exec instance.
 *
 * @param id - Exec instance ID
 */
export const execInspect = (
    options: execInspectOptions
): Effect.Effect<IMobyConnectionAgent, execInspectError, Readonly<ExecInspectResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new execInspectError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/exec/{id}/json";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ExecInspectResponseSchema)))
            .pipe(errorHandler(execInspectError));
    }).pipe(Effect.flatten);

/**
 * Resize the TTY session used by an exec instance. This endpoint only works if
 * `tty` was specified as part of creating and starting the exec instance.
 *
 * @param id - Exec instance ID
 * @param h - Height of the TTY session in characters
 * @param w - Width of the TTY session in characters
 */
export const execResize = (options: execResizeOptions): Effect.Effect<IMobyConnectionAgent, execResizeError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new execResizeError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/exec/{id}/resize";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("h", options.h))
            .pipe(addQueryParameter("w", options.w))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(execResizeError));
    }).pipe(Effect.flatten);

/**
 * Starts a previously set up exec instance. If detach is true, this endpoint
 * returns immediately after starting the command. Otherwise, it sets up an
 * interactive session with the command.
 *
 * @param id - Exec instance ID
 * @param body -
 */
export const execStart = (options: execStartOptions): Effect.Effect<IMobyConnectionAgent, execStartError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new execStartError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/exec/{id}/start";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "ExecStartConfig"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(execStartError));
    }).pipe(Effect.flatten);

/**
 * Run a command inside a running container.
 *
 * @param body - Exec configuration
 * @param id - ID or name of container
 */
export type containerExecWithConnectionAgentProvided = WithConnectionAgentProvided<typeof containerExec>;

/**
 * Return low-level information about an exec instance.
 *
 * @param id - Exec instance ID
 */
export type execInspectWithConnectionAgentProvided = WithConnectionAgentProvided<typeof execInspect>;

/**
 * Resize the TTY session used by an exec instance. This endpoint only works if
 * `tty` was specified as part of creating and starting the exec instance.
 *
 * @param id - Exec instance ID
 * @param h - Height of the TTY session in characters
 * @param w - Width of the TTY session in characters
 */
export type execResizeWithConnectionAgentProvided = WithConnectionAgentProvided<typeof execResize>;

/**
 * Starts a previously set up exec instance. If detach is true, this endpoint
 * returns immediately after starting the command. Otherwise, it sets up an
 * interactive session with the command.
 *
 * @param id - Exec instance ID
 * @param body -
 */
export type execStartWithConnectionAgentProvided = WithConnectionAgentProvided<typeof execStart>;
