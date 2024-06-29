import { Schema as S } from "@effect/schema";

export const AuthConfig = S.Struct({
    username: S.optional(S.String),
    password: S.optional(S.String),
    email: S.optional(S.String),
    serveraddress: S.optional(S.String),
});

export type AuthConfig = S.Schema.Type<typeof AuthConfig>;
export const AuthConfigEncoded = S.encodedSchema(AuthConfig);
export type AuthConfigEncoded = S.Schema.Encoded<typeof AuthConfig>;
