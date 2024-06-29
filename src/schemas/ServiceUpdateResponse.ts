import { Schema as S } from "@effect/schema";

export const ServiceUpdateResponse = S.Struct({
    /** Optional warning messages */
    Warnings: S.optional(S.Array(S.String)),
});

export type ServiceUpdateResponse = S.Schema.Type<typeof ServiceUpdateResponse>;
export const ServiceUpdateResponseEncoded = S.encodedSchema(ServiceUpdateResponse);
export type ServiceUpdateResponseEncoded = S.Schema.Encoded<typeof ServiceUpdateResponse>;
