import { Schema as S } from "@effect/schema";

export const IPAMConfig = S.Struct({
    Subnet: S.optional(S.String),
    IPRange: S.optional(S.String),
    Gateway: S.optional(S.String),
    AuxiliaryAddresses: S.optional(S.Record(S.String, S.String)),
});

export type IPAMConfig = S.Schema.Type<typeof IPAMConfig>;
export const IPAMConfigEncoded = S.encodedSchema(IPAMConfig);
export type IPAMConfigEncoded = S.Schema.Encoded<typeof IPAMConfig>;
