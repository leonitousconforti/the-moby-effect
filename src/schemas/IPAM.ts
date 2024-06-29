import { Schema as S } from "@effect/schema";

import { IPAMConfig } from "./IPAMConfig.js";

export const IPAM = S.Struct({
    /** Name of the IPAM driver to use. */
    Driver: S.optional(S.String, { default: () => "default" }),
    /**
     * List of IPAM configuration options, specified as a map:
     *
     *     {"Subnet": <CIDR>, "IPRange": <CIDR>, "Gateway": <IP address>, "AuxAddress": <device_name:IP address>}
     */
    Config: S.optional(S.Array(IPAMConfig)),
    /** Driver-specific options, specified as a map. */
    Options: S.optional(S.Record(S.String, S.String)),
});

export type IPAM = S.Schema.Type<typeof IPAM>;
export const IPAMEncoded = S.encodedSchema(IPAM);
export type IPAMEncoded = S.Schema.Encoded<typeof IPAM>;
