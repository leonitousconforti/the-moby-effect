import * as Schema from "@effect/schema/Schema";

export class ConfigReference extends Schema.Class<ConfigReference>("ConfigReference")(
    {
        Network: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ConfigReference",
        title: "network.ConfigReference",
    }
) {}
