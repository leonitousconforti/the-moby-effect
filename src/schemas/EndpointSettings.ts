import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { EndpointIPAMConfig } from "./EndpointIPAMConfig.js";

/** Configuration for a network endpoint. */
export const EndpointSettings = S.Struct({
    IPAMConfig: S.optional(EndpointIPAMConfig),
    Links: S.optional(S.Array(S.String)),
    /**
     * MAC address for the endpoint on this network. The network driver might
     * ignore this parameter.
     */
    MacAddress: S.optional(S.String),
    Aliases: S.optional(S.Array(S.String)),
    /** Unique ID of the network. */
    NetworkID: S.optional(S.String),
    /** Unique ID for the service endpoint in a Sandbox. */
    EndpointID: S.optional(S.String),
    /** Gateway address for this network. */
    Gateway: S.optional(S.String),
    /** IPv4 address. */
    IPAddress: S.optional(S.String),
    /** Mask length of the IPv4 address. */
    IPPrefixLen: S.optional(pipe(S.Number, S.int())),
    /** IPv6 gateway address. */
    IPv6Gateway: S.optional(S.String),
    /** Global IPv6 address. */
    GlobalIPv6Address: S.optional(S.String),
    /** Mask length of the global IPv6 address. */
    GlobalIPv6PrefixLen: S.optional(pipe(S.Number, S.int())),
    /**
     * DriverOpts is a mapping of driver options and values. These options are
     * passed directly to the driver and are driver specific.
     */
    DriverOpts: S.optional(S.Record(S.String, S.String)),
    /**
     * List of all DNS names an endpoint has on a specific network. This list is
     * based on the container name, network aliases, container short ID, and
     * hostname.
     *
     * These DNS names are non-fully qualified but can contain several dots. You
     * can get fully qualified DNS names by appending `.<network-name>`. For
     * instance, if container name is `my.ctr` and the network is named
     * `testnet`, `DNSNames` will contain `my.ctr` and the FQDN will be
     * `my.ctr.testnet`.
     */
    DNSNames: S.optional(S.Array(S.String)),
});

export type EndpointSettings = S.Schema.Type<typeof EndpointSettings>;
export const EndpointSettingsEncoded = S.encodedSchema(EndpointSettings);
export type EndpointSettingsEncoded = S.Schema.Encoded<typeof EndpointSettings>;
