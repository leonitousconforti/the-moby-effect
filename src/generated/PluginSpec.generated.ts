import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class PluginSpec extends Schema.Class<PluginSpec>("PluginSpec")(
    {
        name: Schema.optional(Schema.String),
        remote: Schema.optional(Schema.String),
        privileges: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.PluginPrivilege)), {
            nullable: true,
        }),
        disabled: Schema.optional(Schema.Boolean),
        env: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "PluginSpec",
        title: "runtime.PluginSpec",
    }
) {}
