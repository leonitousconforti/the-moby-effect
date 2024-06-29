import { Schema as S } from "@effect/schema";

import { EndpointSettings } from "./EndpointSettings.js";

/**
 * NetworkingConfig represents the container's networking configuration for each
 * of its interfaces. It is used for the networking configs specified in the
 * `docker create` and `docker network connect` commands.
 */
export const NetworkingConfig = S.Struct({
    /**
     * A mapping of network name to endpoint configuration for that network. The
     * endpoint configuration can be left empty to connect to that network with
     * no particular endpoint configuration.
     */
    EndpointsConfig: S.optional(S.Record(S.String, EndpointSettings)),
});

export type NetworkingConfig = S.Schema.Type<typeof NetworkingConfig>;
export const NetworkingConfigEncoded = S.encodedSchema(NetworkingConfig);
export type NetworkingConfigEncoded = S.Schema.Encoded<typeof NetworkingConfig>;
