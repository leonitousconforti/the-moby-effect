import * as Schema from "effect/Schema";

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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#PluginsInfo",
    }
) {}
