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
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/runtime/plugin.pb.go#L25-L33",
    }
) {}
