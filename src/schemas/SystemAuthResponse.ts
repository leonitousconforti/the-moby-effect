import { Schema as S } from "@effect/schema";

export const SystemAuthResponse = S.Struct({
    /** The status of the authentication */
    Status: S.String,

    /** An opaque token used to authenticate a user after a successful login */
    IdentityToken: S.optional(S.String),
});

export type SystemAuthResponse = S.Schema.Type<typeof SystemAuthResponse>;
export const SystemAuthResponseEncoded = S.encodedSchema(SystemAuthResponse);
export type SystemAuthResponseEncoded = S.Schema.Encoded<typeof SystemAuthResponse>;
