import { Schema as S } from "@effect/schema";

/**
 * Available plugins per type.<p><br /></p>> **Note**: Only unmanaged (V1)
 * plugins are included in this list. V1 plugins are "lazily" loaded,> And are
 * not returned in this list if there is no resource using the plugin.
 */
export const PluginsInfo = S.Struct({
    /** Names of available volume-drivers, and network-driver plugins. */
    Volume: S.optional(S.Array(S.String)),
    /** Names of available network-drivers, and network-driver plugins. */
    Network: S.optional(S.Array(S.String)),
    /** Names of available authorization plugins. */
    Authorization: S.optional(S.Array(S.String)),
    /** Names of available logging-drivers, and logging-driver plugins. */
    Log: S.optional(S.Array(S.String)),
});

export type PluginsInfo = S.Schema.Type<typeof PluginsInfo>;
export const PluginsInfoEncoded = S.encodedSchema(PluginsInfo);
export type PluginsInfoEncoded = S.Schema.Encoded<typeof PluginsInfo>;
