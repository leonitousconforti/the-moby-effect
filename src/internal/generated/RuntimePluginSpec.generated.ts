import * as Schema from "effect/Schema";

import * as RuntimePluginPrivilege from "./RuntimePluginPrivilege.generated.ts";

export class RuntimePluginSpec extends Schema.Class<RuntimePluginSpec>("RuntimePluginSpec")(
    {
        name: Schema.optional(Schema.String),
        remote: Schema.optional(Schema.String),
        privileges: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.NullOr(RuntimePluginPrivilege.RuntimePluginPrivilege)))
        ),
        disabled: Schema.optional(Schema.Boolean),
        env: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
    },
    {
        identifier: "RuntimePluginSpec",
        title: "runtime.PluginSpec",
        documentation: "",
    }
) {}
