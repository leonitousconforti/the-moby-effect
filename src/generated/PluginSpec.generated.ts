import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class PluginSpec extends Schema.Class<PluginSpec>("PluginSpec")(
    {
        name: Schema.optional(Schema.String, { nullable: true }),
        remote: Schema.optional(Schema.String, { nullable: true }),
        privileges: Schema.optional(Schema.Array(MobySchemasGenerated.PluginPrivilege), { nullable: true }),
        disabled: Schema.optional(Schema.Boolean, { nullable: true }),
        env: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "PluginSpec",
        title: "runtime.PluginSpec",
    }
) {}
