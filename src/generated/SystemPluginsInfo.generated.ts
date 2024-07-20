import * as Schema from "@effect/schema/Schema";

export class SystemPluginsInfo extends Schema.Class<SystemPluginsInfo>("SystemPluginsInfo")(
    {
        Volume: Schema.NullOr(Schema.Array(Schema.String)),
        Network: Schema.NullOr(Schema.Array(Schema.String)),
        Authorization: Schema.NullOr(Schema.Array(Schema.String)),
        Log: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "SystemPluginsInfo",
        title: "system.PluginsInfo",
    }
) {}
