import { Schema as S } from "@effect/schema";

export const PluginInterfaceType = S.Struct({
    Prefix: S.String,
    Capability: S.String,
    Version: S.String,
});

export type PluginInterfaceType = S.Schema.Type<typeof PluginInterfaceType>;
export const PluginInterfaceTypeEncoded = S.encodedSchema(PluginInterfaceType);
export type PluginInterfaceTypeEncoded = S.Schema.Encoded<typeof PluginInterfaceType>;
