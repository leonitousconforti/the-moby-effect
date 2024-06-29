import { Schema as S } from "@effect/schema";

export const PluginDevice = S.Struct({
    Name: S.String,
    Description: S.String,
    Settable: S.Array(S.String),
    Path: S.String,
});

export type PluginDevice = S.Schema.Type<typeof PluginDevice>;
export const PluginDeviceEncoded = S.encodedSchema(PluginDevice);
export type PluginDeviceEncoded = S.Schema.Encoded<typeof PluginDevice>;
