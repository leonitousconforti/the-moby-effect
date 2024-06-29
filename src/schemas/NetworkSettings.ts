import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { Address } from "./Address.js";
import { EndpointSettings } from "./EndpointSettings.js";
import { PortMap } from "./PortMap.js";

/** NetworkSettings exposes the network settings in the API */
export const NetworkSettings = S.Struct({
    /** Name of the default bridge interface when dockerd's --bridge flag is set. */
    Bridge: S.optional(S.String),
    /** SandboxID uniquely represents a container's network stack. */
    SandboxID: S.optional(S.String),
    /**
     * Indicates if hairpin NAT should be enabled on the virtual interface.
     *
     * Deprecated: This field is never set and will be removed in a future
     * release.
     */
    HairpinMode: S.optional(S.Boolean),
    /**
     * IPv6 unicast address using the link-local prefix.
     *
     * Deprecated: This field is never set and will be removed in a future
     * release.
     */
    LinkLocalIPv6Address: S.optional(S.String),
    /**
     * Prefix length of the IPv6 unicast address.
     *
     * Deprecated: This field is never set and will be removed in a future
     * release.
     */
    LinkLocalIPv6PrefixLen: S.optional(pipe(S.Number, S.int())),
    Ports: S.optional(PortMap),
    /** SandboxKey is the full path of the netns handle */
    SandboxKey: S.optional(S.String),
    /**
     * Deprecated: This field is never set and will be removed in a future
     * release.
     */
    SecondaryIPAddresses: S.optional(S.Array(Address)),
    /**
     * Deprecated: This field is never set and will be removed in a future
     * release.
     */
    SecondaryIPv6Addresses: S.optional(S.Array(Address)),
    /**
     * EndpointID uniquely represents a service endpoint in a Sandbox. <p><br
     * /></p>> **Deprecated**: This field is only propagated when attached to
     * the default "bridge" network.> Use the information from the "bridge"
     * network inside the `Networks` map> Instead, which contains the same
     * information. This field was deprecated> In Docker 1.9 and is scheduled to
     * be removed in Docker 17.12.0
     */
    EndpointID: S.optional(S.String),
    /**
     * Gateway address for the default "bridge" network. <p><br /></p>>
     * **Deprecated**: This field is only propagated when attached to the
     * default "bridge" network.> Use the information from the "bridge" network
     * inside the `Networks` map> Instead, which contains the same information.
     * This field was deprecated> In Docker 1.9 and is scheduled to be removed
     * in Docker 17.12.0
     */
    Gateway: S.optional(S.String),
    /**
     * Global IPv6 address for the default "bridge" network. <p><br /></p>>
     * **Deprecated**: This field is only propagated when attached to the
     * default "bridge" network.> Use the information from the "bridge" network
     * inside the `Networks` map> Instead, which contains the same information.
     * This field was deprecated> In Docker 1.9 and is scheduled to be removed
     * in Docker 17.12.0
     */
    GlobalIPv6Address: S.optional(S.String),
    /**
     * Mask length of the global IPv6 address. <p><br /></p>> **Deprecated**:
     * This field is only propagated when attached to the default "bridge"
     * network.> Use the information from the "bridge" network inside the
     * `Networks` map> Instead, which contains the same information. This field
     * was deprecated> In Docker 1.9 and is scheduled to be removed in Docker
     * 17.12.0
     */
    GlobalIPv6PrefixLen: S.optional(pipe(S.Number, S.int())),
    /**
     * IPv4 address for the default "bridge" network. <p><br /></p>>
     * **Deprecated**: This field is only propagated when attached to the
     * default "bridge" network.> Use the information from the "bridge" network
     * inside the `Networks` map> Instead, which contains the same information.
     * This field was deprecated> In Docker 1.9 and is scheduled to be removed
     * in Docker 17.12.0
     */
    IPAddress: S.optional(S.String),
    /**
     * Mask length of the IPv4 address. <p><br /></p>> **Deprecated**: This
     * field is only propagated when attached to the default "bridge" network.>
     * Use the information from the "bridge" network inside the `Networks` map>
     * Instead, which contains the same information. This field was deprecated>
     * In Docker 1.9 and is scheduled to be removed in Docker 17.12.0
     */
    IPPrefixLen: S.optional(pipe(S.Number, S.int())),
    /**
     * IPv6 gateway address for this network. <p><br /></p>> **Deprecated**:
     * This field is only propagated when attached to the default "bridge"
     * network.> Use the information from the "bridge" network inside the
     * `Networks` map> Instead, which contains the same information. This field
     * was deprecated> In Docker 1.9 and is scheduled to be removed in Docker
     * 17.12.0
     */
    IPv6Gateway: S.optional(S.String),
    /**
     * MAC address for the container on the default "bridge" network. <p><br
     * /></p>> **Deprecated**: This field is only propagated when attached to
     * the default "bridge" network.> Use the information from the "bridge"
     * network inside the `Networks` map> Instead, which contains the same
     * information. This field was deprecated> In Docker 1.9 and is scheduled to
     * be removed in Docker 17.12.0
     */
    MacAddress: S.optional(S.String),
    /** Information about all networks that the container is connected to. */
    Networks: S.optional(S.Record(S.String, EndpointSettings)),
});

export type NetworkSettings = S.Schema.Type<typeof NetworkSettings>;
export const NetworkSettingsEncoded = S.encodedSchema(NetworkSettings);
export type NetworkSettingsEncoded = S.Schema.Encoded<typeof NetworkSettings>;
