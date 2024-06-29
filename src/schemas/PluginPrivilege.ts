import { Schema as S } from "@effect/schema";

/** Describes a permission the user has to accept upon installing the plugin. */
export const PluginPrivilege = S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Value: S.optional(S.Array(S.String)),
});

export type PluginPrivilege = S.Schema.Type<typeof PluginPrivilege>;
export const PluginPrivilegeEncoded = S.encodedSchema(PluginPrivilege);
export type PluginPrivilegeEncoded = S.Schema.Encoded<typeof PluginPrivilege>;
