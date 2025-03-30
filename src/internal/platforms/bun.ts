import type * as HttpClient from "@effect/platform/HttpClient";
import type * as Socket from "@effect/platform/Socket";
import type * as Layer from "effect/Layer";
import type * as MobyConnection from "../../MobyConnection.js";

import * as internalNode from "./node.js";

/** @internal */
export const makeBunHttpClientLayer: (
    connectionOptions: MobyConnection.MobyConnectionOptions
) => Layer.Layer<HttpClient.HttpClient | Socket.WebSocketConstructor, never, never> =
    internalNode.makeNodeHttpClientLayer;
