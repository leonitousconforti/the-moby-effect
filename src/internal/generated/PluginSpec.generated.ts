import * as Schema from "effect/Schema";
import * as PluginPrivilege from "./PluginPrivilege.generated.js";

export class PluginSpec extends Schema.Class<PluginSpec>("PluginSpec")(
    {
        name: Schema.optional(Schema.String),
        remote: Schema.optional(Schema.String),
        privileges: Schema.optionalWith(Schema.Array(Schema.NullOr(PluginPrivilege.PluginPrivilege)), {
            nullable: true,
        }),
        disabled: Schema.optional(Schema.Boolean),
        env: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "PluginSpec",
        title: "runtime.PluginSpec",
        documentation: "",
    }
) {}
