import { Schema as S } from "@effect/schema";

import { EndpointPortConfig } from "./EndpointPortConfig.js";

/** Properties that can be configured to access and load balance a service. */
export const EndpointSpec = S.Struct({
    /** The mode of resolution to use for internal load balancing between tasks. */
    Mode: S.optional(S.Literal("vip", "dnsrr"), {
        default: () => "vip",
    }),
    /**
     * List of exposed ports that this service is accessible on from the
     * outside. Ports can only be provided if `vip` resolution mode is used.
     */
    Ports: S.optional(S.Array(EndpointPortConfig)),
});

export type EndpointSpec = S.Schema.Type<typeof EndpointSpec>;
export const EndpointSpecEncoded = S.encodedSchema(EndpointSpec);
export type EndpointSpecEncoded = S.Schema.Encoded<typeof EndpointSpec>;
