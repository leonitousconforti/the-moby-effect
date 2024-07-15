import * as Schema from "@effect/schema/Schema";

export class PluginConfigRootfs extends Schema.Class<PluginConfigRootfs>("PluginConfigRootfs")(
    {
        diff_ids: Schema.NullOr(Schema.Array(Schema.String)),
        type: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "PluginConfigRootfs",
        title: "types.PluginConfigRootfs",
    }
) {}
