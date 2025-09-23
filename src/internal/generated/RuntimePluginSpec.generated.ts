import * as Schema from "effect/Schema";
import * as RuntimePluginPrivilege from "./RuntimePluginPrivilege.generated.js";

export class RuntimePluginSpec extends Schema.Class<RuntimePluginSpec>("RuntimePluginSpec")(
    {
        name: Schema.optional(Schema.String),
        remote: Schema.optional(Schema.String),
        privileges: Schema.optionalWith(Schema.Array(Schema.NullOr(RuntimePluginPrivilege.RuntimePluginPrivilege)), {
            nullable: true,
        }),
        disabled: Schema.optional(Schema.Boolean),
        env: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "RuntimePluginSpec",
        title: "runtime.PluginSpec",
        documentation: "",
    }
) {}
