import { Schema as S } from "@effect/schema";

export const ProcessConfig = S.Struct({
    privileged: S.optional(S.Boolean),
    user: S.optional(S.String),
    tty: S.optional(S.Boolean),
    entrypoint: S.optional(S.String),
    arguments: S.optional(S.Array(S.String)),
});

export type ProcessConfig = S.Schema.Type<typeof ProcessConfig>;
export const ProcessConfigEncoded = S.encodedSchema(ProcessConfig);
export type ProcessConfigEncoded = S.Schema.Encoded<typeof ProcessConfig>;
