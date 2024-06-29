import { Schema as S } from "@effect/schema";

import { EndpointPortConfig } from "./EndpointPortConfig.js";

/**
 * Represents the port status of a task's host ports whose service has published
 * host ports
 */
export const PortStatus = S.Struct({
    Ports: S.optional(S.Array(EndpointPortConfig)),
});

export type PortStatus = S.Schema.Type<typeof PortStatus>;
export const PortStatusEncoded = S.encodedSchema(PortStatus);
export type PortStatusEncoded = S.Schema.Encoded<typeof PortStatus>;
