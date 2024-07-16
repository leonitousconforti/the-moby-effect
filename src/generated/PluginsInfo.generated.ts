import * as Schema from "@effect/schema/Schema";

export class PluginsInfo extends Schema.Class<PluginsInfo>("PluginsInfo")(
    {
        Volume: Schema.NullOr(Schema.Array(Schema.String)),
        Network: Schema.NullOr(Schema.Array(Schema.String)),
        Authorization: Schema.NullOr(Schema.Array(Schema.String)),
        Log: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "PluginsInfo",
        title: "types.PluginsInfo",
    }
) {}
