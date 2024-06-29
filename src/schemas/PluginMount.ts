import { Schema as S } from "@effect/schema";

export const PluginMount = S.Struct({
    Name: S.String,
    Description: S.String,
    Settable: S.Array(S.String),
    Source: S.String,
    Destination: S.String,
    Type: S.String,
    Options: S.Array(S.String),
});

export type PluginMount = S.Schema.Type<typeof PluginMount>;
export const PluginMountEncoded = S.encodedSchema(PluginMount);
export type PluginMountEncoded = S.Schema.Encoded<typeof PluginMount>;
