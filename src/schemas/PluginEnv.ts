import { Schema as S } from "@effect/schema";

export const PluginEnv = S.Struct({
    Name: S.String,
    Description: S.String,
    Settable: S.Array(S.String),
    Value: S.String,
});

export type PluginEnv = S.Schema.Type<typeof PluginEnv>;
export const PluginEnvEncoded = S.encodedSchema(PluginEnv);
export type PluginEnvEncoded = S.Schema.Encoded<typeof PluginEnv>;
